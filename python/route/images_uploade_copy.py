import base64
from flask import Blueprint, jsonify, request, send_file
import os
from PIL import Image
from werkzeug.utils import secure_filename
from io import BytesIO

image_uploade_bp = Blueprint('image_uploade', __name__)

uploads_folder = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def resize_image(image_path, output_size=(416, 416)):
    with Image.open(image_path) as img:
        img = img.resize(output_size)
        img.save(image_path)

@image_uploade_bp.route('/imgupload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(uploads_folder, filename)

        if not os.path.exists(uploads_folder):
            os.makedirs(uploads_folder)

        file.save(filepath)

        # Resize image
        resize_image(filepath)

        # Read the resized image and encode it to base64
        with open(filepath, 'rb') as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        return jsonify({'message': 'File successfully uploaded and resized', 'image': encoded_string}), 200
    else:
        return jsonify({'message': 'File type not allowed'}), 400

@image_uploade_bp.route('/files', methods=['GET'])
def list_files():
    files = os.listdir(uploads_folder)
    return jsonify({'files': files}), 200
