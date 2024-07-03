import torch
from PIL import Image
from yolov5 import YOLOv5
import pathlib
from pathlib import Path

# 경로 클래스 호환성 문제 해결
pathlib.PosixPath = pathlib.WindowsPath

# 모델 경로
model_path = './runs/best.pt'  # 모델 파일 경로

# YOLOv5 모델 인스턴스 생성 및 자동 모델 로드
model = YOLOv5(model_path)

# 이미지 로드
image_path = './beer.jpg'  # 이미지 파일 경로
img = Image.open(image_path)

# 탐지 실행
results = model.predict(img)

# 탐지 결과 시각화
detected_img = results.render()[0]  # 첫 번째 이미지 결과 가져오기
detected_img = Image.fromarray(detected_img)  # NumPy 배열을 PIL 이미지로 변환

# 이미지 저장
detected_img.save('detected_image.jpg')

# 결과에서 라벨 추출 및 저장
labels = results.names  # 라벨 이름을 불러옴
detections = results.pred[0]  # 첫 번째 이미지의 탐지 결과

# 결과 저장을 위한 파일 오픈
with open('detection_results.txt', 'w') as f:
    for *xyxy, conf, cls in detections:
        label = labels[int(cls)]  # 클래스 인덱스를 라벨 이름으로 변환
        f.write(f'{label}\n')  # 라벨만 저장

print("Detection results saved to 'detection_results.txt'")
