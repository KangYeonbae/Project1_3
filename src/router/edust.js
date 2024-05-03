import React, { useState, useEffect } from 'react';
import '../css/edust.css';
import MyCalendar from "./calendar";

const AutoSwitchingViewer = () => {

    return (
        <div className="munji">
        <img className="munji_map"
            src='/img/lee.gif'
            title="Dynamic HTML Viewer"
        />
            <div className="calendar_big">
            <MyCalendar/>
            </div>
        </div>
    );
};

export default AutoSwitchingViewer;
