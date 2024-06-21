from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename
import os
import subprocess
from PIL import Image
from pathlib import Path

yolo_bp = Blueprint('yolo', __name__)

uploads_folder = os.path.join(os.path.dirname(__file__), '..', 'uploads')
results_folder = os.path.join(os.path.dirname(__file__), '..', 'results')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# YOLO 모델 경로
model_path = str(Path(os.path.join(os.path.dirname(__file__), '..', 'pythonProject', 'yolov5', 'runs', 'best.pt')))
detect_script_path = str(Path(os.path.join(os.path.dirname(__file__), '..', 'pythonProject', 'yolov5', 'detect.py')))

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def resize_image(image_path, output_size=(416, 416)):
    with Image.open(image_path) as img:
        img = img.resize(output_size)
        img.save(image_path)

@yolo_bp.route('/imgupload', methods=['POST'])
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

        if not os.path.exists(results_folder):
            os.makedirs(results_folder)

        file.save(filepath)

        # 이미지 리사이즈
        resize_image(filepath)

        # YOLO 모델을 사용하여 이미지 처리
        command = [
            'python', detect_script_path,
            '--weights', model_path,
            '--conf', '0.3',
            '--source', filepath,
            '--project', results_folder,
            '--name', filename.rsplit('.', 1)[0]
        ]

        try:
            result = subprocess.run(command, check=True, capture_output=True, text=True)
            print(result.stdout)  # 성공 시 출력

            # 결과 이미지를 클라이언트에 전송할 URL 생성
            result_image_dir = os.path.join(results_folder, filename.rsplit('.', 1)[0])
            result_image_path = os.path.join(result_image_dir, filename)

            return jsonify({'message': 'File successfully uploaded and processed', 'result_image_url': f'/results/{filename.rsplit(".", 1)[0]}/{filename}'}), 200
        except subprocess.CalledProcessError as e:
            print(e.stderr)  # 오류 시 출력
            return jsonify({'message': 'Error processing file', 'error': e.stderr}), 500

@yolo_bp.route('/files', methods=['GET'])
def list_files():
    files = os.listdir(uploads_folder)
    return jsonify({'files': files}), 200

@yolo_bp.route('/results/<path:filename>', methods=['GET'])
def get_result_image(filename):
    return send_file(os.path.join(results_folder, filename))
