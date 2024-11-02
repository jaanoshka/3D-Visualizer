from flask import Blueprint, request, jsonify, make_response, send_from_directory, render_template, Response
import os
from app import db
from tables.pointcloud_class import *
from tables.image_class import *
import open3d as o3d
import numpy as np
import pandas as pd
from blueprints.model_blueprint import predict_depth_map
from blueprints.image_blueprint import get_satellite_image_as_pil, get_meter2pix_res, calculate_zoom_for_resolution
import io
import base64
import math
import googlemaps
import app


pointcloud_bp = Blueprint('pointcloud', __name__)

# Initialize Google Maps client
gmaps = googlemaps.Client(key='AIzaSyCEXjMi2OrxvBQNgU8NVxw5GSbSWZUTLmM')

depth_data = None
points_with_lat_lon = None
# Earth radius in meters
EARTH_RADIUS = 6378137
center_lat = None
center_lon = None


def get_rgbd_data(address, center_lat, center_lon, zoom_level):
    try:
        # Get the satellite image as a PIL image
        image = get_satellite_image_as_pil(address)
        print(f'RGB Image shape: {np.asarray(image).shape}')  # Print the shape

        depth = predict_depth_map(image)
        print(f"Depth Image shape: {depth.shape}") 

        rgb_data = np.asarray(image)
        rgb_data = np.clip(rgb_data, 0, 255)  # Ensure RGB values are between 0 and 255
        rgb_df = pd.DataFrame(rgb_data.reshape(-1, 3), columns=['r', 'g', 'b'])

        #depth_data = depth.reshape(-1)
        depth_df = pd.DataFrame(depth.flatten(), columns=['Z'])

        '''# Create a grid of x, y coordinates corresponding to the image pixels
        height, width = depth.shape
        x_coords, y_coords = np.meshgrid(np.arange(width), np.arange(height))

        # Flatten the coordinate arrays
        x_coords_flat = x_coords.flatten()
        y_coords_flat = y_coords.flatten()

        # Add the flattened x, y coordinates to the depth DataFrame
        depth_df['x'] = x_coords_flat
        depth_df['y'] = y_coords_flat'''

        # Initialize an array for storing (x, y, z) coordinates
        points_with_lat_lon = []

        # Loop over every pixel in the depth map
        for index, row in depth_df.iterrows(): 
            x = index
            y = row
            z = row['Z']  # Depth value at (u, v)

            if z >= 0:   # Depth value at (u, v)
                # Add the point (x, y, z) to the list
                points_with_lat_lon.append([x, y, z])
                

        points_with_lat_lon = pd.DataFrame(points_with_lat_lon, columns=['x', 'y', 'z'])

        # Create a copy of the DataFrame to avoid modifying the original view
        rgbd_data = rgb_df.copy()

        # Now you can assign new columns to the copy
        rgbd_data['x'] = points_with_lat_lon['x']
        rgbd_data['y'] = points_with_lat_lon['y']
        rgbd_data['z'] = points_with_lat_lon['z']

        return rgbd_data

    except Exception as e:
        raise ValueError(f"Error creating RGBD image: {str(e)}")

# Function to convert meters to degrees latitude and longitude
def meters_to_lat_lon(distance_meters, latitude):
    # Convert meters to degrees latitude
    meters_per_degree_latitude = 111320
    delta_lat = distance_meters / meters_per_degree_latitude

    # Convert meters to degrees longitude (adjusted for latitude)
    meters_per_degree_longitude = 111320 * math.cos(math.radians(latitude))
    delta_lon = distance_meters / meters_per_degree_longitude

    return delta_lat, delta_lon

# Function to calculate real-world latitude and longitude from image indices
def indices_to_lat_lon(u, v, center_lat, center_lon, zoom_level, image_width, image_height):
    # Get meters per pixel at the current zoom level and latitude
    meters_per_pixel = get_meter2pix_res(zoom_level, center_lat)

    # Calculate the offset from the center in pixels
    u_offset = u - (image_width / 2)
    v_offset = v - (image_height / 2)

    # Convert the pixel offsets to meters
    distance_x_meters = u_offset * meters_per_pixel
    distance_y_meters = v_offset * meters_per_pixel

    # Convert the distances to latitude and longitude offsets
    delta_lat, delta_lon = meters_to_lat_lon(distance_y_meters, center_lat)
    _, delta_lon = meters_to_lat_lon(distance_x_meters, center_lat)

    # Compute the final latitude and longitude
    latitude = center_lat + delta_lat
    longitude = center_lon + delta_lon

    return latitude, longitude

def create_poisson_mesh(pcd, depth=11):
    print("Starte Poisson-Mesherstellung...")
    # Mesh mit der Poisson-Methode erstellen
    poisson_mesh = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
        pcd, depth=depth, width=0, scale=1.1, linear_fit=False)[0]

    # Rückgabe des erzeugten Meshes
    return poisson_mesh

# Example usage for point cloud conversion
@pointcloud_bp.route('/mesh', methods=['POST'])
def generate_pointcloud_with_lat_lon():
    try:
        data = request.get_json() 
        address = data['address'] 
        # Get center latitude and longitude from address
        geocode_result = gmaps.geocode(address)
        if not geocode_result:
            raise ValueError("Invalid address")

        location = geocode_result[0]['geometry']['location']
        center_lat, center_lon = location['lat'], location['lng']

        zoom_level = calculate_zoom_for_resolution(center_lat)
        print(f"Calculated zoom: {zoom_level}")

        rgbd_df = get_rgbd_data(address, center_lat, center_lon, zoom_level)

        points = rgbd_df[['x', 'y', 'z']].to_numpy()
        point_cloud = o3d.geometry.PointCloud()
        point_cloud.points = o3d.utility.Vector3dVector(points)

        if 'r' in rgbd_df.columns and 'g' in rgbd_df.columns and 'b' in rgbd_df.columns:
            colors = rgbd_df[['r', 'g', 'b']].to_numpy() / 255.0
            point_cloud.colors = o3d.utility.Vector3dVector(colors)

        if point_cloud is not None:
            poisson_mesh = create_poisson_mesh(point_cloud)
            
            # Save mesh to a bytes buffer instead of a file
            mesh_buffer = io.BytesIO()
            o3d.io.write_triangle_mesh(mesh_buffer, poisson_mesh, write_ascii=True)
            mesh_buffer.seek(0)

            # Encode the mesh data as base64
            mesh_base64 = base64.b64encode(mesh_buffer.read()).decode('utf-8')

        return jsonify({"mesh": mesh_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pointcloud_bp.route('/pointcloud/<path:filename>')
def serve_point_cloud(filename):
    return send_from_directory(os.getcwd(), filename)

@pointcloud_bp.route('/view')
def view_point_cloud():
    return render_template('view_point_cloud.html')


# get pointcloud by id
@pointcloud_bp.route('/pointclouds/<int:id>', methods=['GET'])
def get_3d_model(id):
    try:
        pointcloud = Pointcloud.query.filter_by(id=id).first()
        if pointcloud:
            return make_response(jsonify({'pointcloud': pointcloud.json()}), 200)
        return make_response(jsonify({'message': 'pointcloud not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting pointcloud'}), 500)

# update a pointcloud
@pointcloud_bp.route('/pointclouds/<int:id>', methods=['PUT'])
def update_3d_model(id):
    try:
        pointcloud = Pointcloud.query.filter_by(id=id).first()
        if pointcloud:
            data = request.get_json()
            pointcloud.model_name = data['model_name']
            pointcloud.grid_data = data['grid_data']
            pointcloud.resolution = data['resolution']
            db.session.commit()
            return make_response(jsonify({'message': 'pointcloud updated'}), 200)
        return make_response(jsonify({'message': 'pointcloud not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error updating pointcloud'}), 500)

