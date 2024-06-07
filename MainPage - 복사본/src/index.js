import React from 'react';
import ReactDOM from 'react-dom/client'; // react-dom/client로 경로 변경
import './index.css'; // CSS 파일 가져오기
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // createRoot 사용
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
