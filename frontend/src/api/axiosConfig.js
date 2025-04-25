import axios from 'axios';

const api = axios.create({
  baseURL: '/api/',// all requests go to /api/ by default
  headers: { 'Content-Type': 'application/json' },
});


const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.Authorization = `Token ${token}`;
}

export default api;
