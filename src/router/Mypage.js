import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import "../css/mypage.css"

function Mypage({ user, setLoginUser, setLoginStatus }) {
    const [userInfo, setUserInfo] = useState({
        nickname: '',
        realname: '',
        mileage: 0 // 마일리지 필드 추가
    });
    const [mileageAmount, setMileageAmount] = useState(0); // 마일리지 조작을 위한 상태 추가


    // 마일리지 입력값 변경 처리 함수
    const handleMileageChange = (event) => {
        setMileageAmount(event.target.value);
    };

    // 사용자 정보 로드 useEffect
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user || !user.userid) return;

            try {
                const response = await axios.get('http://localhost:3001/mypage', { withCredentials: true });
                setUserInfo({
                    nickname: response.data.NICKNAME,
                    realname: response.data.REALNAME,
                    mileage: response.data.MILEAGE
                });
                console.log(response.data);
            } catch (error) {
                console.error('Failed to fetch user info:', error.response ? error.response.data : error.message);
            }
        };

        fetchUserInfo();
    }, [user]);
    // 마일리지 적립 함수
    // const handleAddMileage = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:3001/mileage/add', { amount: mileageAmount }, { withCredentials: true });
    //         if (response.status === 200) {
    //             alert('Mileage added successfully!');
    //             setUserInfo({ ...userInfo, mileage: userInfo.mileage + parseInt(mileageAmount) });
    //         }
    //     } catch (error) {
    //         console.error('Failed to add mileage:', error.response ? error.response.data : error.message);
    //     }
    // };



    // 마일리지 차감 함수
    const handleUseMileage = async () => {
        try {
            const response = await axios.post('http://localhost:3001/mileage/use', { amount: mileageAmount }, { withCredentials: true });
            if (response.status === 200) {
                alert('Mileage used successfully!');
                // 마일리지 사용 후 다시 사용자 정보를 가져옴
                const userInfoResponse = await axios.get('http://localhost:3001/mypage', { withCredentials: true });
                setUserInfo({
                    nickname: userInfoResponse.data.NICKNAME,
                    realname: userInfoResponse.data.REALNAME,
                    mileage: userInfoResponse.data.MILEAGE
                });
            }
        } catch (error) {
            console.error('Failed to use mileage:', error.response ? error.response.data : error.message);
            alert('Failed to use mileage.');
        }
    };

    return (
        <>
            <div className="Mypage_header_box"></div>
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        My Page
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">
                            Nickname: {userInfo.nickname}
                        </Typography>
                        <Typography variant="subtitle1">
                            Real Name: {userInfo.realname}
                        </Typography>
                        <Typography variant="subtitle1">
                            Mileage: {userInfo.mileage}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Mileage Management
                        </Typography>
                        <TextField
                            label="Amount"
                            type="number"
                            value={mileageAmount}
                            onChange={handleMileageChange}
                            fullWidth
                            sx={{ mb: 2 }}
                        />

                        <Button variant="contained" color="secondary" onClick={handleUseMileage}>
                            Use Mileage
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default Mypage;