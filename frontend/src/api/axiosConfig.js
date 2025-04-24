import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',
  headers: { 'Content-Type': 'application/json' },
});

// read token from localStorage, if set
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.Authorization = `Token ${token}`;
}

export default api;
