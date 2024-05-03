import './App.css';
import MyMap from "./router/KakaoMap";
import Weather from "./router/weather";
import React, { useState, useEffect } from "react";
import {Route, Router, Routes, Link, useNavigate, NavLink, Outlet} from 'react-router-dom'
import {FiAlignJustify} from 'react-icons/fi';
import {IoLogoWechat} from "react-icons/io5";
import Chatbot from "./router/chatbot";
import {TiWeatherWindyCloudy} from "react-icons/ti";
import LoginPage from "./router/login";
import LogoutPage from "./router/logout";
import AutoSwitchingViewer from "./router/edust"
import Search_location from "./router/search_location";
import Search_location_car from "./router/search_location_car";
import ChartComponent from "./router/Chart"
import {GiEcology, GiHamburgerMenu} from "react-icons/gi";
import {FaBusAlt, FaCar} from "react-icons/fa";
import {FaPersonWalking, FaTrainSubway} from "react-icons/fa6";
import RealtimeLineChart from "./router/realtimechart";

function App() {
    let navigate = useNavigate();
    // 로그인 상태를 localStorage에서 로드
    const loadAuthData = () => {
        const storedIsLogin = localStorage.getItem('isLogin');
        const storedLogin = localStorage.getItem('login');
        if (storedIsLogin && storedLogin) {
            return { isLogin: storedIsLogin === 'true', login: JSON.parse(storedLogin) };
        }
        return { isLogin: false, login: { userid: '', nickname: '' } };
    };

    const [isLogin, setIsLogin] = useState(loadAuthData().isLogin);
    const [login, setLogin] = useState(loadAuthData().login);

    // 로그인 상태 변경시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('isLogin', isLogin);
        localStorage.setItem('login', JSON.stringify(login));
    }, [isLogin, login]);

    // 로그아웃 로직 구현
    const logout = () => {
        setIsLogin(false);
        setLogin({ userid: '', nickname: '' });
        localStorage.removeItem('isLogin');
        localStorage.removeItem('login');
        navigate("/logout");
    };


    // 현재 날짜 받아오기
    const toDay = new Date();
    const formatDate = `${toDay.getFullYear()}-${toDay.getMonth() + 1}-${toDay.getDate()}`;

    // 챗봇창 열기
    let [chatbot, setChatbot] = useState(false)


    return (
        <div className="App">
            <header className="top-nav">
                <h1><NavLink to="/">
                    <h3><span>ECO</span> RECYCLE HUB</h3>
                </NavLink>
                </h1>
                <div className="site-icon">
                    <GiEcology/>
                </div>
                <nav className="nav-links">
                    <NavLink to='/mymap'>Eco-Map</NavLink>
                    <NavLink to="/edust">초미세먼지현황</NavLink>
                    <NavLink to="/chart">전국재활용처리</NavLink>
                </nav>

            </header>

            <header className="header-Top">
                <div className="tNumb-address">
                    <h5 className="site-numb">
                        T.02-2038-0800</h5>
                    <h5 className="address">서울 금천구 가산디지털2로 144 현대테라타워 가산DK 20층</h5>
                </div>

                <div className="user-btn">
                    {isLogin ? (
                        <div className="login-btn">
                            <button className="dropdown-btn">{login.nickname} ▼</button>
                            <div className="dropdown-content">
                                <NavLink className="myPage" to="/mypage">마이페이지</NavLink>
                                <button className="nav-link" onClick={logout}>로그아웃</button>
                            </div>
                        </div>
                    ) : (
                        <NavLink to="/login" className="login-btn">로그인</NavLink>
                    )}
                    <GiHamburgerMenu/>
                </div>

            </header>

            <div className="Chatbot">
                <button
                    className="chat-open-btn"
                    // onClick={openChat}
                    onClick={() => {
                        setChatbot(!chatbot)
                    }}><IoLogoWechat/>
                </button>
                {''}
                {chatbot && <Chatbot closeChat={() => setChatbot(false)}/>}
            </div>

            <section className="main-con">
                <Routes>
                    <Route path="/" element={
                        <div className = "Info_main">
                        <div className="Info">

                        <h1>Echo Recycling Hub</h1>
                        <h2> 환영합니다! </h2>
                        <p>우리의 목표는 지구와 함께 지속 가능한 생활을 영위하고자 하는 모두에게 유용한 정보와 도구를 제공하는 것입니다.</p>
                        <p>이 웹 페이지는 지도 기능을 활용하여 주변 재활용 센터, 페트병 수거 자판기, 제로 웨이스트 샵과 같은 환경 관련 시설을 쉽게 찾을 수 있도록 도와줍니다.</p>
                        <p> 더불어, 폐기물 배출량과 미세먼지 농도와 같은 환경 지표를 시각적으로 제공하여 사용자들이 지역의 환경 상태를 쉽게 파악할 수 있습니다.</p>

                        <p> 또한, 사용자의 위치를 기준으로 가장 가까운 제로 웨이스트 샵까지의 길찾기 기능을 제공하여 지속 가능한 소비를 장려합니다.</p>
                        <p> 이를 통해 우리는 각자의 일상 속에서 환경을 생각하고 실천할 수 있는 기회를 제공하고자 합니다.</p>

                        <p> 우리는 지구를 위한 작은 변화가 모여 큰 변화를 이끌어낼 수 있다고 믿습니다. 함께하는 모든 분들의 작은 노력이 우리의 환경을 더욱</p>
                        <p> 건강하고 지속 가능하게 만들어갈 것입니다.</p>
                        <p> 지금 바로 이 웹 페이지를 통해 우리의 환경을 위한 첫걸음을 내딛어보세요. 함께라면 가능합니다!</p>
                    </div>
                        <RealtimeLineChart/>
                    </div>
                    }/>
                    <Route path="/MyMap"
                           element={<MyMap/>}/>
                    <Route path="/login"
                           element={<LoginPage setLoginStatus={setIsLogin} setLoginUser={setLogin}/>}/>
                    <Route path="/logout" element={<LogoutPage/>}/>
                    <Route path="/edust" element={<AutoSwitchingViewer/>}/>
                    <Route path="/search" element={<Search_location/>}/>
                    <Route path="/car" element={<Search_location_car/>}/>
                    <Route path="/chart" element={<ChartComponent/>}/>
                </Routes>
            </section>

        </div>
    );
}


function WeatherStatus() {

    return (
        <div className="model">
            <img
                style={{width: "43%", height: "auto", float: "right"}}
                alt="초미세먼지 모델 한반도"
                src="https://www.airkorea.or.kr/file/proxyImage?fileName=2024/04/16/AQFv1_09h.20240414.KNU_09_01.PM2P5.2days.ani.gif"
            />
        </div>
    );
}


export default App;
