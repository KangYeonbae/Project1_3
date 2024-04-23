import './App.css';
import Forgine from "./router/forgine";
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

function App() {


    const [currentView, setCurrentView] = useState(null);
    const toggleView = (view) => {
        setCurrentView(currentView === view ? null : view);
    };

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

    let [chatbot, setChatbot] = useState(false)
    const [showSidos, setShowSidos] = useState(false);  // 새로운 상태 추가


    const [selectedSido, setSelectedSido] = useState(null);
    const [sidos, setSidos] = useState([
        '강원도', '경기도', '경상도', '광주', '대구',
        '대전', '부산', '서울', '인천', '울산',
        '전라도', '제주', '충청도'
    ]);

    const handleSidoSelection = (sido) => {
        // 현재 선택된 지역이 다시 클릭되면 선택 해제
        if (selectedSido === sido) {
            setSelectedSido(null);
        } else {
            setSelectedSido(sido);
        }
    };

    // 시도 지역페이지나누기
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 9; // 한 페이지당 9개의 항목을 표시
    const maxPage = Math.ceil(sidos.length / itemsPerPage) - 1;

    // 페이지를 변경하는 함수
    const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, maxPage));
    const goToPrevPage = () => setCurrentPage((page) => Math.max(page - 1, 0));

    // 현재 페이지에 맞는 항목의 범위 계산
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sidos.slice(startIndex, endIndex);



    const [selectZeroWaste, setSelectZeroWaste] = useState(null);
    const [zeroWastes, setzeroWastes] = useState(['제로마켓', '서울', '경기', '인천', '강원도', '충청도','경상도', '전라도', '제주도']);
    const [showWastes, setShowWastes] = useState(false);  // 새로운 상태 추가

    const handleZeroWasteSelection = (zeroWaste) => {
        // 현재 선택된 카테고리가 다시 클릭되면 선택 해제
        if (selectZeroWaste === zeroWaste) {
            setSelectZeroWaste(null);
        } else {
            setSelectZeroWaste(zeroWaste);
        }
    };


    const [selectMark, setSelectZeroMark] = useState(null);
    const [zeroMarks, setzeroMarks] = useState(['서울', '경기', '인천', '강원도', '충청도','경상도', '전라도', '제주']);

    const handleMarkSecletion = (zeroMark) =>{
        if(selectMark === zeroMark) {
            setSelectZeroMark(null);
        }else {
            setSelectZeroMark(zeroMark);
        }
    }


    return (
        <div className="App">
            <header className="header-Top">
                <NavLink to ="/" className="gradient-text"><h1>Eco-Recycling Hub</h1></NavLink>
                {isLogin ? (
                    <div className="login-btn">
                        <button className="dropdown-btn">{login.nickname} ▼</button>
                        <div className="dropdown-content">
                            <NavLink className="myPage" to="/mypage" >마이페이지</NavLink>
                            <button className="nav-link" onClick={logout}>로그아웃</button>
                        </div>
                    </div>
                ) : (
                    <NavLink to="/login" className="login-btn">로그인</NavLink>
                )}
            </header>
            <header className="top-nav">
                <h1><TiWeatherWindyCloudy/><NavLink to="/"> 에리허브</NavLink></h1>
                <nav className="nav-links">
                    <NavLink to ='/forgine'>대기질현황</NavLink>
                    <NavLink to="/edust">대기오염예보</NavLink>
                </nav>
                <div className="nav-info">
                    <span>{formatDate}</span>
                    <a href="https://www.weather.go.kr/w/index.do" target="_blank">현재기온</a>
                </div>
            </header>

            <section className="sidebar">
                <header>
                    <nav>
                        <button className="hamburger-btn">
                            <FiAlignJustify/>
                        </button>
                        <h2><NavLink to ="/forgine">ECO Recycle Hub</NavLink></h2>
                    </nav>
                    <div className="head-weather">
                        <div className="myLocation">
                            <Weather/>
                        </div>
                    </div>
                </header>
                <div className="main-contents">
                    <div className="small_nav">
                        <button className="nav_button" onClick={() => toggleView('sidos')}>페트병수거함</button>
                        <button className="nav_button" onClick={() => toggleView('zeroWastes')}>제로웨이스트</button>
                        <button className="nav_button" onClick={() => toggleView('zeroMarks')}>재활용센터</button>
                    </div>
                    {currentView === 'sidos' && (
                        <div>
                        <div className="senter-marker">
                              {currentItems.map((sido) => (
                                <button key={sido} onClick={() => handleSidoSelection(sido)}>
                                    {sido}
                                </button>
                            ))}
                            </div>
                            <div className="pagination">
                                <button onClick={goToPrevPage} disabled={currentPage === 0}>
                                    이전
                                </button>
                                <button onClick={goToNextPage} disabled={currentPage === maxPage}>
                                    다음
                                </button>
                            </div>
                        </div>
                    )}
                    {currentView === 'zeroWastes' && (
                        <div className="senter-marker">
                            {zeroWastes.map((zeroWaste, index) => (
                                <button key={zeroWaste} onClick={() => handleZeroWasteSelection(zeroWaste)}>
                                    {zeroWaste}
                                </button>
                            ))}
                        </div>
                    )}
                    {currentView === 'zeroMarks' && (
                        <div className="senter-marker">
                            {zeroMarks.map((zeroMark, index) => (
                                <button key={zeroMark} onClick={() => handleMarkSecletion(zeroMark)}>
                                    {zeroMark}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
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

            </section>


            <section className="main-con">
                <Routes>
                    <Route path="/" element={<div className="Info">

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
                    </div>}/>
                    <Route path="/forgine"
                           element={<Forgine selectedSido={selectedSido} selectZeroWaste={selectZeroWaste} selectMark={selectMark}/>}/>
                    <Route path="/MyMap"
                           element={<MyMap selectedSido={selectedSido} selectZeroWaste={selectZeroWaste} selectMark={selectMark}/>}/>
                    <Route path="/login"
                           element={<LoginPage setLoginStatus={setIsLogin} setLoginUser={setLogin} />}/>
                    <Route path="/logout" element={<LogoutPage/>}/>
                    <Route path="/edust" element={<AutoSwitchingViewer/>}/>
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
