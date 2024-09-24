import React, { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

// Imposta l'URL dell'API (backend) usando la variabile d'ambiente
const socket = io(process.env.REACT_APP_API_URL || 'https://gerico.onrender.com', {
  withCredentials: true, // Permette la condivisione delle credenziali tra frontend e backend
});

// SocketProvider per fornire il contesto a tutta l'app
export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
