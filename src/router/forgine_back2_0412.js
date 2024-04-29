import React, { useEffect, useRef, useState } from 'react';
import MyMap from "./KakaoMap";
import Chatbot from "./chatbot";
import Modal from "./modal";
import axios from "axios";
import { Route, useParams } from "react-router-dom";
import '../css/forgine.css';
import { Card, Button } from "react-bootstrap";
import {QueryClient, QueryClientProvider} from 'react-query';

function Forgine(props) {
    let [userInput, setuserInput] = useState('');
    let [city, setCity] = useState(['일본', '뉴옥', '상해', '태국','필리핀','유럽']);
    let [cityTitle,setCityTitle] = useState(0);
    let [e, setE] = useState('바다가자');
    let [activeIndex, setActiveIndex] = useState(0);
    let [modal, setModal] = useState(false);
    let [chatbot, setChatbot] = useState(false);
    let [myCal, setMycal] = useState(false);
    let [sidebar, setSidedar] = useState(false);
    const queryClient = new QueryClient();
    let [prevE, setPrevE] = useState('');
    let [prevCity, setPrevCity] = useState([]);
    let [account, setAccount] = useState(['서울설명','대전설명','대구설명', '부산설명','강릉설명','양양설명']);
    let [prevAccount, setPrevAccount] = useState([]);
    let [cityImg, setCityImg] = useState([
        "/img/seoul.jpg",
        "/img/daejeon.jpg",
        "/img/daegu.jpg",
        "/img/busan.jpg",
        "/img/gang.jpg",
        "/img/yang.jpg"
    ]);


    const getBackgroundColor = (index) => {
        const colors = ['lightblue',
            'lightgreen',
            'lightpink',
            'lightyellow',
            'lightcoral',
            'lightcyan'];
        return colors[index % colors.length];
    };

    const handlePrevClick = () => {
        const prevIndex = (activeIndex - 1 < 0 ? city.length - 1 : activeIndex - 1);
        setActiveIndex(prevIndex);
        const cityLists = document.querySelectorAll('.F_city-list');
        if (cityLists) {
            cityLists.forEach((cityList, index) => {
                cityList.style.transform = `translateX(-${prevIndex * 100}vw)`;
            });
        }
    };

    const handleNextClick = () => {
        const nextIndex = (activeIndex + 1) % city.length;
        setActiveIndex(nextIndex);
        const cityLists = document.querySelectorAll('.F_city-list');
        if (cityLists) {
            cityLists.forEach((cityList, index) => {
                cityList.style.transform = `translateX(-${nextIndex * 100}vw)`;
            });
        }
    };

    return (
        <div className="App">
            <div className="memo">
                <div className="cla">
                <QueryClientProvider client={queryClient}>
                    <MyApp />
                </QueryClientProvider>
                </div>
                <div className="memo_box">

                </div>
            </div>

            <div className="K_header">
            <div className="F_big_content">
                    {city.map((cityName, i) => (
                        <div className="F_city-list">
                            <h2>
                                <button className="이전" onClick={handlePrevClick}>이전</button>
                                <button className="다음" onClick={handleNextClick}>다음</button>
                            </h2>
                            <img className="img_box"
                                 src={cityImg[i]}
                                 style={{width: '300px', height: '300px'}}
                            />
                            <h4 onClick={() => {
                                setModal(!modal)
                                setCityTitle(i)
                            }}>{cityName}</h4>
                            <p>{account[i]}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="input_box">
                <input type="text" onChange={(e) => {
                    setuserInput(e.target.value);
                }}/>
                <button onClick={() => {
                    let copy = [...city];
                    copy.unshift(userInput);
                    setCity(copy)
                }}>지역추가
                </button>
            </div>

            <div>
                <div className="Map">
                    <h1>Korea Component</h1>
                    {/*<div className="googleMap">*/}
                    {/*    <GoogleMap/>*/}
                    {/*</div>*/}
                    <div className="KakaoMap">
                        <MyMap/>
                    </div>
                </div>
            </div>
            {modal && <Modal city={city} setCity={setCity} cityTitle={cityTitle} setCityTitle={setCityTitle}/>}
            <div>
                <Button className="chat_box" variant="outline-warning" onClick={() => {
                    setChatbot(!chatbot)
                }}><p>chat!!</p></Button>{' '}
                {chatbot && <Chatbot city={city} setCity={setCity} cityTitle={cityTitle} setCityTitle={setCityTitle}/>}
            </div>
            {modal && <button className="close-button" onClick={() => setModal(false)}>X</button>}
        </div>
    );
}

export default Forgine;
