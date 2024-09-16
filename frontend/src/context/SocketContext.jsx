import React, { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

// Verifica se siamo in ambiente di produzione o sviluppo
const socketURL = process.env.NODE_ENV === 'production'
  ? 'https://gerico.onrender.com' // URL di produzione
  : 'http://localhost:5000'; // URL di sviluppo

const socket = io(socketURL, {
  withCredentials: true,
});

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
