import random as rnd  # 이름 변경

import cx_Oracle
from flask import Flask, jsonify, request, send_from_directory
from flask_restful import Resource, Api
from flask_cors import CORS
import requests
import pandas as pd
import json
import geopandas as gpd
import xml.etree.ElementTree as ET

app = Flask(__name__)
api = Api(app)
CORS(app)
app.debug = True


# API Key(은지님)
# access_key = 'BjziMs2j8QwD1JAtzP7oQ5KCJmP/xDfhiJ2fn7Zev9geBe37W238GnmAyuSM6YTFbTFuyUEAveKWYItWTmKvWQ=='
# access_key = 'BjziMs2j8QwD1JAtzP7oQ5KCJmP%2FxDfhiJ2fn7Zev9geBe37W238GnmAyuSM6YTFbTFuyUEAveKWYItWTmKvWQ%3D%3D'
#API Key(강연배)
access_key = 'y+MUXWRZdywDBDs64HplB3XAbAYdvxWcQ54m88FRrpMBgZAm1tcqkUc8xkXrtl4eRgFiJLN2Tmi/2iJp8tQX9A=='


@app.route('/api/random-data')
def random_data():
    random_number = rnd.randint(0, 150)  # 변경된 모듈 이름 사용
    return jsonify({'value': random_number})

@app.route('/api/random-data1')
def random_data1():
    random_number = rnd.randint(0, 99)  # 변경된 모듈 이름 사용
    return jsonify({'value': random_number})

@app.route('/location', methods=['GET', 'POST'])
def receive_location():
    if request.method == 'POST':
        data = request.get_json()
        current_latitude = data['currentLatitude']
        current_longitude = data['currentLongitude']
        clicked_latitude = data['clickedLatitude']
        clicked_longitude = data['clickedLongitude']

        # API 호출 및 데이터 파싱
        response = get_request_url(current_latitude, current_longitude, clicked_latitude, clicked_longitude)
        response_data = json.loads(response)

        # 고유 노선 ID 추출
        unique_route_ids = extract_unique_route_ids(response_data)

        # 버스 데이터 가져오기
        bus_routes_data = get_bus_data(unique_route_ids.values())

        # 필요한 경우 여기서 response_data를 추가로 필터링하여 중복 제거

        # 전체 응답 데이터와 함께 버스 루트 데이터 반환
        return jsonify({
            'message': 'Received and processed your request.',
            'fullResponseData': response_data,  # 전체 응답 데이터 추가
            'busRoutesData': bus_routes_data
        }), 200
    else:
        return jsonify({'error': 'Method Not Allowed'}), 405
def extract_unique_route_ids(response_data):
    unique_routes = {}
    items = response_data.get('msgBody', {}).get('itemList', [])
    for item in items:
        for path in item.get('pathList', []):
            route_nm = path.get('routeNm')
            route_id = path.get('routeId')
            # routeNm 이 같은 경우 첫 번째 등장한 것만 저장
            if route_nm and route_id and route_nm not in unique_routes:
                unique_routes[route_nm] = route_id
    return unique_routes


def get_request_url(current_latitude, current_longitude, clicked_latitude, clicked_longitude):
    url = "http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoByBusNSub"
    params = {
        'serviceKey': access_key,
        'resultType': 'json',
        'startX': current_longitude,
        'startY': current_latitude,
        'endX': clicked_longitude,
        'endY': clicked_latitude
    }
    response = requests.get(url, params=params)
    print("Raw API Response:", response.text)
    return response.text

# 버스노선그리기
#API Key(강연배)
# bus_access_key = 'fesb%2Bj8fOHKjzliPcpuavNbsf0uBz3UH5e4Fyp3hq35oMWrBXLPEtwlecJr6NZgdNVSzGERT3ORnk3hM6itlVg%3D%3D'
bus_access_key = 'fesb+j8fOHKjzliPcpuavNbsf0uBz3UH5e4Fyp3hq35oMWrBXLPEtwlecJr6NZgdNVSzGERT3ORnk3hM6itlVg=='


@app.route('/bus', methods=['GET', 'POST'])
# 아래는 get_bus_url 함수를 수정한 버전입니다.
def get_bus_data(route_ids):
    bus_routes_data = {}
    for route_id in route_ids:
        url = 'http://ws.bus.go.kr/api/rest/busRouteInfo/getRoutePath'
        params = {
            'serviceKey': bus_access_key,
            'busRouteId': route_id,
            'resultType': 'json'
        }
        response = requests.get(url, params=params)
        print(f"Raw API Response1 for route_id {route_id}:", response.text)

        # 응답을 JSON으로 변환
        response_data = response.json()

        # 응답 검증
        header_cd = response_data.get('msgHeader', {}).get('headerCd')
        items = response_data.get('msgBody', {}).get('itemList')

        if header_cd == '0' and items:
            # 응답 데이터가 있는 경우에만 저장
            bus_routes_data[route_id] = response_data

    return bus_routes_data



# 자동차 길찾기
@app.route('/kakao', methods=['GET', 'POST'])
def receive_location1():
    if request.method == 'GET':
        return jsonify({'message': 'GET 요청을 성공적으로 처리했습니다.'}), 200
    elif request.method == 'POST':
        data = request.get_json()
        current_latitude = data['currentLatitude']
        current_longitude = data['currentLongitude']
        clicked_latitude = data['clickedLatitude']
        clicked_longitude = data['clickedLongitude']

        # API 호출을 위한 부분
        response = get_request_url1(current_latitude, current_longitude, clicked_latitude, clicked_longitude)

        return jsonify(
            {
                'message': f'Received current latitude: {current_latitude}, current longitude: {current_longitude}, clicked latitude: {clicked_latitude}, clicked longitude: {clicked_longitude}',
                'carRouteInfo': response}), 200
    else:
        return jsonify({'error': 'Method Not Allowed'}), 405

def get_request_url1(current_latitude, current_longitude, clicked_latitude, clicked_longitude):
    url = "https://apis-navi.kakaomobility.com/v1/directions"
    params = {
        'origin': f"{current_longitude},{current_latitude}",
        'destination': f"{clicked_longitude},{clicked_latitude}",
        'priority': "RECOMMEND",
        'roadevent': 0,  # 도로 전면 통제 정보 반영 설정
        'alternatives': False,
        'road_details': False,
        'car_type': 1,  # 차종 정보
        'car_fuel': "GASOLINE",
        'car_hipass': False,
        'summary': False
    }
    headers = {
        "Authorization": 'KakaoAK 1c1d1475bcff3988e508016fe07cd96c',
        # "Authorization": "4755be2274b0f534aae434a5dfe21164",
        "Content-Type": "application/json"
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print("Error:", response.status_code)
        return None




class City(Resource):
    def get(self):  # 메서드 이름을 get으로 변경하고 self 추가
        # SHP 파일 로드
        kor = gpd.read_file('C:\\KYB\\Project\\2_WepProject\\3_React\\React_clone_test\\kyb_study\\server\\python\\seoul_EPSG5179.shp', encoding='utf-8')

        kor.rename(columns={'nm': '시군구명'}, inplace=True)

        # 필요한 데이터만 선택 (예: 시군구명, 경계선 좌표)
        kor_data = kor[['시군구명', 'geometry']]

        # GeoJSON 형식으로 변환 후 반환
        kor_geojson = kor_data.set_crs("EPSG:4326", allow_override=True).to_json()

        return jsonify(kor_geojson)

api.add_resource(City, '/city')


if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    app.run(host='localhost')
