import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // 사용자 정보 상태 추가
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // 사용자 정보를 로드하는 로직 추가 (예: authService.getUser)
            authService.getUser().then(userData => {
                setUser(userData);
                setIsAuthenticated(true);
            });
        }
    }, []);

    const login = async (userid, password) => {
        try {
            const response = await authService.login(userid, password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                setIsAuthenticated(true);
                // 사용자 정보 설정
                setUser(response.user);
                navigate('/');
            } else {
                console.error('Token not found in response');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null); // 사용자 정보 초기화
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
