from flask import Blueprint, request, jsonify, make_response
import torch
from app import db
from tables.model_class import *
from transformers import AutoImageProcessor, AutoModelForDepthEstimation

model_bp = Blueprint('model_bp', __name__)

# Load model explicitly on CPU if CUDA is not available
image_processor = AutoImageProcessor.from_pretrained("depth-anything/Depth-Anything-V2-Base-hf")
model = AutoModelForDepthEstimation.from_pretrained("depth-anything/Depth-Anything-V2-Base-hf")
model.load_state_dict(torch.load("/app/backend/depth_anything_16k_mix_batch_40_lr_0.0005_epoch_9.pth", weights_only=True, map_location=torch.device('cpu')))
model.eval()

# Predict depth of input image
def predict_depth_map(image):
    # Ensure the image is in RGB format (3 channels)
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Preprocess the image for the depth model
    inputs = image_processor(images=image, return_tensors="pt")
 
    # Predict the depth map
    with torch.no_grad():
        outputs = model(**inputs)
        predicted_depth = outputs.predicted_depth.squeeze(0).numpy()  # Add a channel dimension if necessary
        
    return predicted_depth

    
# create a pointcloud
@model_bp.route('/models', methods=['POST'])
def create_3d_model():
    try:
        data = request.get_json()
        new_model = Model(model_name=data['model_name'], depth_unit=data['depth_unit'], input_data_size=data['input_data_size'])
        db.session.add(new_model)
        db.session.coment()
        return make_response(jsonify({'message': 'model created'}), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'error creating model'}), 500)

# get model by id
@model_bp.route('/models/<int:id>', methods=['GET'])
def get_3d_model(id):
    try:
        model = Model.query.filter_by(id=id).first()
        if model:
            return make_response(jsonify({'model': model.json()}), 200)
        return make_response(jsonify({'message': 'model not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error getting model'}), 500)

# update a model
@model_bp.route('/model/<int:id>', methods=['PUT'])
def update_3d_model(id):
    try:
        pointcloud = Model.query.filter_by(id=id).first()
        if pointcloud:
            data = request.get_json()
            pointcloud.model_name = data['model_name']
            pointcloud.depth_unit = data['depth_unit']
            pointcloud.input_data_size = data['input_data_size']
            db.session.commit()
            return make_response(jsonify({'message': 'model updated'}), 200)
        return make_response(jsonify({'message': 'model not found'}), 404)
    except Exception as e:
        return make_response(jsonify({'message': 'error updating model'}), 500)

