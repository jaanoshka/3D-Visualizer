from app import db
from flask import Blueprint, request, jsonify, make_response, send_file, Flask
from tables.image_class import *
import googlemaps
import requests
import base64
import io
from PIL import Image
import math

image_bp = Blueprint('image_bp', __name__)

zoom_level = 0
lat = 0
address = ''
pcd = None
image = None
open3d_depth = None
open3d_rgb = None
predicted_depth = None
desired_final_size = 518  # Final desired size in pixels (both width and height)
watermark_pixels = 19  # Number of pixels to remove from the bottom


# Initialize Google Maps client
gmaps = googlemaps.Client(key='AIzaSyCEXjMi2OrxvBQNgU8NVxw5GSbSWZUTLmM')

# Function to calculate meters per pixel at a given zoom and latitude
def get_meter2pix_res(zoom, latitude):
    return 156543.03 * math.cos(math.pi / 180 * latitude) / (2 ** zoom)

# Function to calculate the required zoom level for 50cm (0.5 meters) per pixel resolution
def calculate_zoom_for_resolution(latitude, desired_resolution_m=0.5):
    for zoom in range(21, 0):  # Start from high zoom levels and go down
        resolution = get_meter2pix_res(zoom, latitude)
        if resolution == desired_resolution_m:
            return zoom
        elif resolution < desired_resolution_m:
            continue
        elif resolution > desired_resolution_m:
            return zoom - 1
    return 18  # If no zoom level satisfies the resolution

# Function to get the correct API request size
def get_correct_api_size(scale_factor):
    # Original size should be larger to compensate for cropping and resizing
    original_height = int((desired_final_size / scale_factor) + watermark_pixels)
    original_width = int(desired_final_size / scale_factor)

    return original_width, original_height

# create a image
@image_bp.route('/image', methods=['POST'])
def  get_satellite_image():
    try:
        data = request.get_json() 
        address = data['address'] 
        # Get the latitude and longitude from the address
        geocode_result = gmaps.geocode(address)
        if not geocode_result:
            raise ValueError("Invalid address")

        location = geocode_result[0]['geometry']['location']
        lat, lng = location['lat'], location['lng']

        zoom_level = calculate_zoom_for_resolution(lat, desired_resolution_m=0.5)
        print(f"Calculated zoom: {zoom_level}")

        # Calculate the meters per pixel for a given zoom level and latitude
        resolution = get_meter2pix_res(zoom_level, lat)

        # Calculate the scaling factor based on the target resolution (0.5 meters/pixel)
        scale_factor = resolution / 0.5

        # Get the correct API request size
        api_width, api_height = get_correct_api_size(scale_factor)
        print(f"API Width: {api_width}, API Height: {api_height}")

        # Get the satellite image using Google Maps Static API
        static_map_url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom={zoom_level}&size={api_width}x{api_height}&maptype=satellite&key=AIzaSyCEXjMi2OrxvBQNgU8NVxw5GSbSWZUTLmM"
        response = requests.get(static_map_url)

        print(f"Status code: {response.status_code}")  # Check the status code
        print(response.content)  # Print the content of the response
        if response.status_code != 200:
            raise ValueError("Failed to fetch satellite image")

        # Wrap the image content in a BytesIO object
        image_bytes = io.BytesIO(response.content)
        image = Image.open(image_bytes)

        # Crop the bottom part with the watermark (Assuming 20 pixels at the bottom)
        width, height = image.size
        cropped_image = image.copy().crop((0, 0, width, height - watermark_pixels))

        if resolution != 0.5:
            new_height = int(api_height * scale_factor)
            new_width = int(api_width * scale_factor)
            resized_image = cropped_image.resize((new_height, new_width))
        else:
            resized_image = cropped_image

        # Ensure the image is in RGB mode
        if resized_image.mode != 'RGB':
            resized_image = resized_image.convert('RGB')

        resized_image = resized_image.resize((desired_final_size, desired_final_size))

        # Convert the image to a byte stream
        image_io = io.BytesIO()
        resized_image.save(image_io, 'JPEG')  # Change 'JPEG' if needed
        image_io.seek(0)

        # Return the image as a file response
        return send_file(image_io, mimetype='image/jpeg')

    except Exception as e:
        raise e


def get_satellite_image_as_pil(address):
    try:
        # Get the latitude and longitude from the address
        geocode_result = gmaps.geocode(address)
        if not geocode_result:
            raise ValueError("Invalid address")

        location = geocode_result[0]['geometry']['location']
        lat, lng = location['lat'], location['lng']

        zoom_level = calculate_zoom_for_resolution(lat, desired_resolution_m=0.5)
        print(f"Calculated zoom: {zoom_level}")

        # Calculate the meters per pixel for a given zoom level and latitude
        resolution = get_meter2pix_res(zoom_level, lat)

        # Calculate the scaling factor based on the target resolution (0.5 meters/pixel)
        scale_factor = resolution / 0.5

        # Get the correct API request size
        api_width, api_height = get_correct_api_size(scale_factor)
        print(f"API Width: {api_width}, API Height: {api_height}")

        # Get the satellite image using Google Maps Static API
        static_map_url = f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom={zoom_level}&size={api_width}x{api_height}&maptype=satellite&key=AIzaSyCEXjMi2OrxvBQNgU8NVxw5GSbSWZUTLmM"
        response = requests.get(static_map_url)

        print(f"Status code: {response.status_code}")  # Check the status code
        print(response.content)  # Print the content of the response
        if response.status_code != 200:
            raise ValueError("Failed to fetch satellite image")

        # Wrap the image content in a BytesIO object
        image_bytes = io.BytesIO(response.content)
        image = Image.open(image_bytes)

        # Crop the bottom part with the watermark (Assuming 20 pixels at the bottom)
        width, height = image.size
        cropped_image = image.copy().crop((0, 0, width, height - watermark_pixels))

        if resolution != 0.5:
            new_height = int(api_height * scale_factor)
            new_width = int(api_width * scale_factor)
            resized_image = cropped_image.resize((new_height, new_width))
        else:
            resized_image = cropped_image

        # Ensure the image is in RGB mode
        if resized_image.mode != 'RGB':
            resized_image = resized_image.convert('RGB')

        resized_image = resized_image.resize((desired_final_size, desired_final_size))

        return resized_image

    except Exception as e:
        raise e

# create a image
@image_bp.route('/images', methods=['POST'])
def create_image():
    try:
        data = request.get_json()
        new_image = Image(image_data=data['image_data'], northing=data['northing'], easting=data['easting'])
        db.session.add(new_image)
        db.session.coment()
        return make_response(jsonify({'message': 'image created'}), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'error creating image'}), 500)

# get image by id
@image_bp.route('/images/<int:id>', methods=['GET'])
def get_image(id):
    try:
        image = Image.query.filter_by(id=id).first()
        if image:
            return make_response(jsonify({'image': image.json()}), 200)
        return make_response(jsonify({'message': 'image not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting image'}), 500)

# update a image
@image_bp.route('/images/<int:id>', methods=['PUT'])
def update_image(id):
    try:
        image = Image.query.filter_by(id=id).first()
        if image:
            data = request.get_json()
            image.image_data = data['image_data']
            image.northing = data['northing']
            image.easting = data['easting']
            db.session.commit()
            return make_response(jsonify({'message': 'image updated'}), 200)
        return make_response(jsonify({'message': 'image not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error updating image'}), 500)


