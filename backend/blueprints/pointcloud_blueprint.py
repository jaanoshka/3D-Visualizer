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

def get_rgbd_data(depth, image): 
    height, width = depth.shape
    points = []
    for y in range(height):
        for x in range(width):
            z = depth[y, x]
            r, g, b = image[y, x]
            points.append([x, y, z, r, g, b])

    points_np = np.array(points)

    return points_np

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

        # Get the satellite image as a PIL image and convert it to a NumPy array
        image = get_satellite_image_as_pil(address)

        image_np = np.asarray(image)  # Convert to NumPy array
        rgb_data = np.clip(image_np, 0, 255)  # Ensure RGB values are between 0 and 255
        rgb_df = pd.DataFrame(rgb_data.reshape(-1, 3), columns=['r', 'g', 'b'])
        print(f'RGB Image shape: {image_np.shape}')  # Print the shape
        
        depth = predict_depth_map(image) 
        print(f"Depth Image shape: {depth.shape}") 

        rgbd_np_array = get_rgbd_data(depth, image_np)

        points = rgbd_np_array[['x', 'y', 'z']]
        point_cloud = o3d.geometry.PointCloud()
        point_cloud.points = o3d.utility.Vector3dVector(points)

        if 'r' in rgbd_np_array.columns and 'g' in rgbd_np_array.columns and 'b' in rgbd_np_array.columns:
            colors = rgbd_np_array[['r', 'g', 'b']].to_numpy() / 255.0
            point_cloud.colors = o3d.utility.Vector3dVector(colors)

        if point_cloud is not None:
            poisson_mesh = create_poisson_mesh(point_cloud)
            poisson_mesh.compute_vertex_normals()

            # Save mesh to ASCII-format PLY in a text buffer
            ply_buffer = io.StringIO()
            o3d.io.write_triangle_mesh(ply_buffer, poisson_mesh, write_ascii=True)
        
        # Return the content of the buffer
        ply_content = ply_buffer.getvalue()
        ply_buffer.close()
        
        # Flask response as plain text
        return ply_content, 200, {'Content-Type': 'text/plain'}
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

