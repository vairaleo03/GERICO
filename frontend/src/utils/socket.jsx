// src/utils/socket.js

import { io } from 'socket.io-client';

let socket;

export const initiateSocket = (token) => {
  socket = io(process.env.REACT_APP_API_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect_error', (err) => {
    console.error('Errore di connessione Socket:', err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const subscribeToNotifications = (callback) => {
  if (!socket) return;
  socket.on('notification', (notification) => {
    callback(notification);
  });
};
