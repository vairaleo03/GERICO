// src/context/SocketContext.js
import React, { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io(process.env.REACT_APP_API_URL ||'https://api.render.com/deploy/srv-crjedq2j1k6c73flonc0?key=zRmNPSvH9Rs/api', {
  withCredentials: true,
});

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};