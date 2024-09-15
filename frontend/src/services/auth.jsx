// src/services/auth.js
import api from './api';

export const login = async (email, password) => {
  return await api.post('/auth/login', { email, password });
};

export const register = async (name, email, password) => {
  return await api.post('/auth/register', { name, email, password });
};

export const logout = async () => {
  return await api.get('/auth/logout');
};

export const isAuthenticated = () => {
  return localStorage.getItem('user') !== null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export const clearUser = () => {
  localStorage.removeItem('user');
};
