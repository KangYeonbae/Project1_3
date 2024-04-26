// import './App.css';
import {useEffect, useState} from "react";
import {Map, MapMarker, Polyline} from "react-kakao-maps-sdk";
import axios from "axios"


function Serch_location() {
    // 마우스 클릭 좌표
    const [clickedLat, setClickedLat] = useState(null);
    const [clickedLng, setClickedLng] = useState(null);

    // 사용자의 현재 위치 주소를 받아온다.
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);

    // 카카오맵 state
    const [result, setResult] = useState("")
    const [mapLocation, setMapLocation] = useState(null)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                handleSuccess,
                handleError,
                {enableHighAccuracy: true, maximumAge: 0, timeout: 5000}
            );
        } else {
            setError('Geolocation이 지원되지 않습니다.');
        }
    }, []);

    // 사용자의 현재 위치를 가져오는 함수
    const handleSuccess = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
        sendLocationData(position.coords.latitude, position.coords.longitude);
    }

    // 클릭 위치 설정 (예제를 위한 함수, 실제 구현은 다를 수 있음)
    const handleMapClick = (event) => {
        setClickedLat(event.lat);  // 이벤트에 따라 변경 필요
        setClickedLng(event.lng);  // 이벤트에 따라 변경 필요
    };

    const handleError = (error) => {
        setError(`위치 정보를 받아오는 데 실패했습니다: ${error.message}`);
    }

    // 유저의 현재위치를 location에 반환
    const sendLocationData = () => {
        if (latitude && longitude && clickedLat && clickedLng) { // 모든 값이 유효할 때만 전송
            const data = {
                currentLatitude: latitude,
                currentLongitude: longitude,
                clickedLatitude: clickedLat,
                clickedLongitude: clickedLng
            };
            axios.post('http://localhost:5000/location', data)
                .then(response => {
                    console.log('서버 응답:', response.data);
                })
                .catch(error => {
                    console.error('서버 전송 중 오류 발생:', error.response ? error.response.data : error);
                });
        } else {
            console.error('모든 위치 정보가 준비되지 않았습니다.');
        }
    };

    const [busRoutes, setBusRoutes] = useState([]);

    const handleFetchData = async () => {
        try {
            const response = await axios.post('http://localhost:5000/location', {
                currentLatitude: latitude,  // 사용자의 현재 위도
                currentLongitude: longitude,  // 사용자의 현재 경도
                clickedLatitude: clickedLat,  // 사용자가 클릭한 위치의 위도
                clickedLongitude: clickedLng  // 사용자가 클릭한 위치의 경도
            });
            const data = JSON.parse(response.data.busRouteInfo);
            setBusRoutes(data.msgBody.itemList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    // 버스경로지도표시
    const renderBusRoutes = () => {
        return busRoutes.map((route, index) => (
            <Polyline
                key={index}
                path={[
                    {lat: parseFloat(route.pathList[0].fy), lng: parseFloat(route.pathList[0].fx)},
                    {lat: parseFloat(route.pathList[0].ty), lng: parseFloat(route.pathList[0].tx)}
                ]}
                strokeWeight={5} // 선의 두께
                strokeColor={'#FF0000'} // 선의 색깔
                strokeOpacity={0.7} // 선의 불투명도
                strokeStyle={'solid'} // 선의 스타일
            />
        ));
    };


    return (
        <div className="App">

            {error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <p>latitude: {latitude}</p>
                    <p>longitude: {longitude}</p>
                </div>
            )}
            <div>
                <p>{}</p>
            </div>
            <div className="kakao-map">
                <>
                    <Map // 지도를 표시할 Container
                        id="map"
                        center={{
                            // 지도의 중심좌표
                            lat: latitude,
                            lng: longitude,
                        }}
                        style={{
                            width: "500px",
                            height: "350px",
                        }}
                        level={3} // 지도의 확대 레벨
                        onClick={(_, mouseEvent) => {
                            const Maplatlng = mouseEvent.latLng
                            const Maplat = Maplatlng.getLat().toFixed(7);
                            const Maplng = Maplatlng.getLng().toFixed(7)
                            setResult(
                                // `클릭한 위치의 위도는 ${Maplatlng.getLat()} 이고, 경도는 ${Maplatlng.getLng()} 입니다`,
                                `클릭한 위치의 위도는 ${Maplat} 이고, 경도는 ${Maplng} 입니다`,
                            )
                            setClickedLat(Maplat); // 클릭한 위도 저장
                            setClickedLng(Maplng); // 클릭한 경도 저장
                        }}
                    >
                        {renderBusRoutes()}

                        <div className="map">
                            <p>
                                <em>지도를 클릭해주세요!</em>
                            </p>
                            <p id="result">{result}</p>
                        </div>
                    </Map>
                    <button onClick={sendLocationData}>위치 전송</button>
                </>
                <div>
                    <button onClick={handleFetchData}>Get Bus Route Info</button>
                    <div>
                        {busRoutes.map((route, index) => (
                            <div key={index}>
                                <h3> Name: {route.pathList[0].routeNm}</h3>
                                <p>Time: {route.time} minutes</p>
                                <p>출발지: {route.pathList[0].fname}</p>
                                <p>도착지: {route.pathList[0].tname}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Serch_location;
