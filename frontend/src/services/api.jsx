// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.render.com/deploy/srv-crjedq2j1k6c73flonc0?key=zRmNPSvH9Rs/api',
  withCredentials: true, // Deve essere true per inviare i cookie
});

export default api;