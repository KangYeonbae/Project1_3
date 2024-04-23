import cx_Oracle
from flask import Flask, jsonify, send_from_directory
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

@app.route('/')
def home():
    return "미세먼지 시각화"

@app.route('/html/<path:filename>')
def serve_html(filename):
    # 정적 HTML 파일을 제공하는 라우트
    return send_from_directory('C:/KYB/Project/3_DataScience/05_Integration/02_쇼핑몰_응답서버/01_테스트/미세먼지html', filename)

def get_db_connection():
    connection = cx_Oracle.connect('kyb/1111@localhost:1521/xe')
    return connection

def parse_kml_to_json(kml_path):
    tree = ET.parse(kml_path)
    root = tree.getroot()
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    places = []

    for placemark in root.findall('.//kml:Placemark', ns):
        name = placemark.find('.//kml:name', ns)
        coordinates = placemark.find('.//kml:Point/kml:coordinates', ns)
        if name is not None and coordinates is not None:
            coords = coordinates.text.strip().split(',')
            longitude, latitude = coords[0], coords[1]
            places.append({"name": name.text, "latitude": latitude, "longitude": longitude})

    return places  # JSON 직렬화 대신 Python 객체 반환

class Zero(Resource):
    def get(self):
        # API 호출 시 실시간으로 KML 파일을 파싱하고 결과 반환
        kml_path = 'C:\\KYB\\Project\\2_WepProject\\3_React\\React_clone_test\\kyb_study\\server\\public\\csv\\zero.kml'
        places = parse_kml_to_json(kml_path)
        return jsonify(places)  # jsonify로 직접 반환

# '/places' 엔드포인트를 Places 클래스에 매핑
api.add_resource(Zero, '/zero')


class Napron(Resource):
    def get(self):
            zero = pd.read_csv(
                'C:\\KYB\\Project\\2_WepProject\\3_React\\React_clone_test\\kyb_study\\server\\public\\csv\\napron_final.csv',
                encoding='utf-8')
            zero_json = zero.to_json(orient='records')  # 'records' 형식으로 JSON 변환
            zero_dict = json.loads(zero_json)  # JSON 문자열을 Python 리스트(딕셔너리의 리스트)로 변환
            return jsonify(zero_dict)  # 리스트를 jsonify로 반환


api.add_resource(Napron, '/Napron')


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

class Recycling(Resource):
    def get(self):
        connection = get_db_connection()
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT * FROM RecyclingCenters")
            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            return jsonify(results)
        finally:
            cursor.close()
            connection.close()

api.add_resource(Recycling, '/recycling')

if __name__ == '__main__':
    app.run(host='localhost')
