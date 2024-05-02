import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {GoPaperAirplane} from "react-icons/go";
import {IoClose} from "react-icons/io5";
import {RiRobot2Fill} from "react-icons/ri";
import "../css/ChatBot.css";

function Chatbot(props) {
    const [chatHistory, setChatHistory] = useState([]);
    const [responses, setResponses] = useState([]);

    const chatContainerRef = useRef(null);

// 데이터 불러오기 예시
    useEffect(() => {
        const fetchData = async (url) => {
            try {
                const result = await axios.get(url);
                return result.data;
            } catch (error) {
                console.error(`Error fetching from ${url}: `, error);
                return [];
            }
        };

        const loadAllData = async () => {
            const newMarkData = await fetchData('http://localhost:3001/recyclingcenters');
            const zeroData = await fetchData('http://localhost:3001/zero');
            const placesData = await fetchData('http://localhost:3001/napron');

            // 상태에 저장 혹은 추가적인 로직 구현
            setResponses({ newMarkData, zeroData, placesData });
        };

        loadAllData();
        console.log(loadAllData)
    }, []);


    function welcomeMessage() {
        let message = '안녕하세요.\n서울시 지도페이지입니다.\n' + '위치를 알고 싶은 상호명을 입력해주세요.';
        return message;
    }


    async function getReverseGeocodingData(latitude, longitude) {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: 'json'
                }
            });
            return response.data.display_name;  // 이 필드에 주소 정보가 포함되어 있습니다.
        } catch (error) {
            console.error('Failed to fetch address:', error);
            return '주소를 불러오는 데 실패했습니다.';
        }
    }

    async function sendMessage() {
        const userInput = document.getElementById('textInput').value.toLowerCase().trim();
        if (userInput !== '') {
            appendMessage('User\n', userInput);

            let responseMessage = '해당 정보를 찾을 수 없습니다.';

            console.log(responses)

            // 먼저 마커 정보를 검색
            const markerInfo = responses.newMarkData.find(m => m.재활용센터명.toLowerCase().includes(userInput));
            if (markerInfo) {
                responseMessage = `재활용센터 관련 정보 입니다.\n센터명: ${markerInfo.재활용센터명}\n주소: ${markerInfo.소재지도로명주소}\n전화번호: ${markerInfo.운영기관전화번호}\n웹사이트: ${markerInfo.홈페이지주소 || '홈페이지 정보가 없습니다.'}`;
                appendMessage('ChatBot', responseMessage);
            } else {
                // 마커 정보가 없으면 장소 정보를 검색
                const placeInfo = responses.placesData.find(p => p.name.toLowerCase().includes(userInput));
                if (placeInfo) {
                    const address = await getReverseGeocodingData(placeInfo.latitude, placeInfo.longitude);
                    responseMessage = `제로웨이트샵 입니다.\n장소명: ${placeInfo.name}\n주소: ${address}`;
                    appendMessage('ChatBot', responseMessage);
                } else {
                    // 장소 정보도 없으면 zero 정보를 검색
                    const zeroInfo = responses.zeroData.find(z => z.name.toLowerCase().includes(userInput));
                    if (zeroInfo) {
                        responseMessage = `네프론관련정보입니다. \n위치: ${zeroInfo.name}\n상세주소: ${zeroInfo.address}\n취급종류: ${zeroInfo.input_wastes}`;
                        appendMessage('ChatBot', responseMessage);
                    } else {
                        appendMessage('ChatBot', responseMessage);
                    }
                }
            }
            document.getElementById('textInput').value = '';
        }
    }
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }


    function appendMessage(sender, message) {
        try {
            const newMessage = {sender, message};
            setChatHistory(prevChatHistory => [...prevChatHistory, newMessage]);

            // 채팅 컨테이너의 스크롤을 자동으로 최하단으로 이동시킵니다.
            if (chatContainerRef.current) {
                setTimeout(() => {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                }, 100); // 비동기 방식으로 즉시 업데이트가 아닌 약간의 지연 후 스크롤, UI 업데이트를 보장
            }
        } catch (error) {
            console.error("Error appending message: ", error);
        }
    }



    return (
        <div className="ChatbotIn">
            <div className="chatbot-header">
                <span className="chat-icon">
                    <RiRobot2Fill/>
                </span>
                <div className="bot-info">
                    <h5>EReHubBot</h5>
                    <p>Visiters Supporter</p>
                </div>
                <button className="chat-close-btn">
                    <IoClose onClick={props.closeChat}/>
                </button>
            </div>
            <div className="message-display-container" ref={chatContainerRef}>
                    <div className="welcome-message">
                        {welcomeMessage()}
                    </div>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`chat-message-${message.sender === 'User' ? 'user' : 'bot'}`}>
                        <strong>{message.sender}:</strong> <div>{message.message}</div>
                    </div>
                ))}
            </div>
            <div className="sendMessage">
                <input id="textInput" type="text" placeholder="메세지를 입력하세요." onKeyDown={handleKeyDown}/>
                <button onClick={sendMessage}><GoPaperAirplane/></button>
            </div>
        </div>
    );
}

export default Chatbot;
