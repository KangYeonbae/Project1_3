import React, { useState } from 'react';
import MyMap from "./KakaoMap";
import { Link, useNavigate } from 'react-router-dom';

function Forgine({selectedSido, selectZeroWaste, selectMark, setReashop, onMarkerClick, onZeroClick, setOpenZero, onNapronClick, setNapronOpen}) {
    let navigate = useNavigate();
    let [chatbot, setChatbot] = useState(false)

    const toDay = new Date();
    const formatDate = `${toDay.getFullYear()}년 ${toDay.getMonth() + 1}월 ${toDay.getDate()}일`;

    return (
            <div className="Map">
                <MyMap selectedSido={selectedSido} selectZeroWaste={selectZeroWaste} selectMark={selectMark} setReashop={setReashop}
                       setOpenZero={setOpenZero} onMarkerClick={onMarkerClick} onZeroClick={onZeroClick} onNapronClick={onNapronClick} setNapronOpen={setNapronOpen} /> {/* selectedSido prop 전달 */}
            </div>
    );
}

export default Forgine;
