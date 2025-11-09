import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true 
});

export default api;
