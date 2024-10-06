// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SpecialPickups from './components/SpecialPickups';
import PrivateRoute from './utils/PrivateRoute';
import './App.css';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Router>
        <Navbar />
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotte protette */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/special-pickups"
            element={
              <PrivateRoute roles={['service']}>
                <SpecialPickups />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
