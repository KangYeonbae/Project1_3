import React, { useState } from "react";
import axios from 'axios';
import '../css/login.css'; // 이렇게 CSS 파일을 임포트하세요
import { useNavigate } from 'react-router-dom';

function LoginPage({ setLoginStatus, setLoginUser }) {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setUserId(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://54.82.4.76:3000/login', {
                userid: userId,
                password: password
            }, { withCredentials: true });
            console.log(response.data);
            if (response.status === 200) {
                setLoginStatus(true);  // 로그인 상태를 true로 설정
                setLoginUser(response.data.user);  // 사용자 정보 업데이트 (전체 객체 전달)
                navigate('/mypage'); // 마이페이지로 리다이렉트
            } else {
                console.log("로그인 실패: 잘못된 자격증명");
            }
        } catch (error) {
            console.error("로그인 요청 실패:", error);
        }
    };

    return (
        <>
            <div className="header_box"></div>
            <div className="login-container">
                <form className="login-form" onSubmit={onSubmitHandler}>
                    <label htmlFor="userId">ID</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={onEmailHandler}
                        placeholder="사용자 ID를 입력하세요"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={onPasswordHandler}
                        placeholder="비밀번호를 입력하세요"
                    />
                    <button type="submit">로그인</button>
                </form>
            </div>
        </>
    );
}

export default LoginPage;
