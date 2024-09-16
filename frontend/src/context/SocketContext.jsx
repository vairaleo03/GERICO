// src/context/SocketContext.js
import React, { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io('https://gerico.onrender.com', {
  withCredentials: true,
});

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
