import axios from 'axios';

const API_URL = 'http://localhost:3001/';

const register = (userData) => {
    return axios.post(`${API_URL}register`, userData);
};

const login = (userData) => {
    return axios.post(`${API_URL}login`, userData);
};

export default { register, login };
