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
    app.run(host='localhost')
