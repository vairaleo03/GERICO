// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import { initiateSocket, disconnectSocket } from '../utils/socket';
import { CircularProgress } from '@mui/material';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    user: null,
    loading: true,
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (authState.token) {
        try {
          const res = await axios.get('/auth/user', {
            headers: { Authorization: `Bearer ${authState.token}` },
          });
          setAuthState({ ...authState, user: res.data, loading: false });
          initiateSocket(authState.token);
        } catch (err) {
          console.error(err);
          setAuthState({ token: null, user: null, loading: false });
        }
      } else {
        setAuthState({ token: null, user: null, loading: false });
      }
    };

    fetchUser();

    return () => {
      disconnectSocket();
    };
    // eslint-disable-next-line
  }, [authState.token]);

  const login = async (token) => {
    localStorage.setItem('token', token);
    try {
      const res = await axios.get('/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthState({ token, user: res.data, loading: false });
      initiateSocket(token);
    } catch (err) {
      console.error(err);
      setAuthState({ token: null, user: null, loading: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ token: null, user: null, loading: false });
    disconnectSocket();
  };

  if (authState.loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
