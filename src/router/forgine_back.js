import React, { useEffect, useRef, useState } from 'react';
import MyMap from "./KakaoMap";
import Chatbot from "./chatbot";
import Modal from "./modal";
import axios from "axios";
import { Route, useParams } from "react-router-dom";
import '../css/forgine.css';
import { Card, Button } from "react-bootstrap";
import Calendar from 'react-calendar'
// import responses from "./responses.json";

function Forgine(props) {
    let [userInput, setuserInput] = useState('');
    let [city, setCity] = useState(['일본', '뉴옥', '상해', '태국','필리핀','유럽']);
    let [cityTitle,setCityTitle] = useState(0);
    let [e, setE] = useState('바다가자');
    let [activeIndex, setActiveIndex] = useState(0);
    let [modal, setModal] = useState(false);
    let [chatbot, setChatbot] = useState(false);
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
                <Button variant="outline-warning" onClick={() => {
                    setChatbot(!chatbot)
                }}>chat!!</Button>{' '}
                {chatbot && <Chatbot city={city} setCity={setCity} cityTitle={cityTitle} setCityTitle={setCityTitle}/>}
            </div>
            {modal && <Modal city={city} setCity={setCity} cityTitle={cityTitle} setCityTitle={setCityTitle}/>}
            <div>
                <div className="Map">
                    <h1>Korea Component</h1>
                    {/*<div className="googleMap">*/}
                    {/*    <GoogleMap/>*/}
                    {/*</div>*/}
                    <div className = "KakaoMap">
                        <MyMap/>
                    </div>
                </div>
            </div>

        </div>
    );
}



export default Forgine;
