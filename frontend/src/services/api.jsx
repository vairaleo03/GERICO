import axios from 'axios';

// Verifica se siamo in ambiente di produzione o sviluppo
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://gerico.onrender.com/api' // URL del backend in produzione
  : 'http://localhost:5000/api'; // URL del backend in sviluppo

const api = axios.create({
  baseURL,
  withCredentials: true, // Deve essere true per inviare i cookie
});

export default api;
