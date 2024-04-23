import React, { useState, useEffect } from 'react';
import '../css/edust.css';

const AutoSwitchingViewer = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const totalFiles = 23; // 총 HTML 파일 수
    const [opacityClass, setOpacityClass] = useState('iframe-visible');

    useEffect(() => {
        const interval = setInterval(() => {
            setOpacityClass('iframe-hidden'); // 일단 투명하게 만들고
            setTimeout(() => {
                setCurrentIndex(current => current === totalFiles ? 1 : current + 1);
                setOpacityClass('iframe-visible'); // 새 인덱스 적용 후 다시 보이게 함
            }, 1000); // 반 페이드 아웃 시간 후 실행
        }, 4000); // 전체 주기는 4초로 늘림

        return () => clearInterval(interval);
    }, [totalFiles]);

    return (
        <iframe
            className={`iframe-transition ${opacityClass}`}
            src={`http://localhost:5000/html/heatmap_${currentIndex}.html`}
            style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 140px)', border: 'none', float: 'left' }}
            title="Dynamic HTML Viewer"
        />
    );
};

export default AutoSwitchingViewer;
