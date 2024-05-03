import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'en-US': require('date-fns/locale/en-US')
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const MyCalendar = () => {
    const [events, setEvents] = useState([]);
    const API_KEY = process.env.REACT_APP_WEATHER_KEY2;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily`, {
                params: {
                    key: API_KEY,
                    lat: latitude,
                    lon: longitude,
                    days: '16'
                }
            })
                .then(response => {
                    const weatherData = response.data.data;
                    const weatherEvents = weatherData.map(day => ({
                        title: `${day.weather.description}, Temp: ${day.temp}°C`,
                        start: new Date(day.valid_date),
                        end: new Date(day.valid_date),
                        allDay: true
                    }));
                    setEvents(weatherEvents);
                })
                .catch(error => console.error('날씨 데이터를 가져오는 중 오류 발생:', error));
        });
    }, [API_KEY]);

    return (
        <div style={{ height: '700px', width: '100%' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default MyCalendar;
