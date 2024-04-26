import React, { useState, useEffect } from 'react';
import '../css/edust.css';

const AutoSwitchingViewer = () => {

    return (
        <div className="munji">
        <img className="munji_map"
            src='/img/lee.gif'
            style={{ width: 'calc(100vw - 400px)', height: 'calc(100vh - 140px)', border: 'none', float: 'left' }}
            title="Dynamic HTML Viewer"
        />
        </div>
    );
};

export default AutoSwitchingViewer;
