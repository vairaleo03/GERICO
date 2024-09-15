// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PatientsPage from './pages/PatientsPage';
import AiDiagnosisPage from './pages/AiDiagnosisPage';
import AiSessionsPage from './pages/AiSessionsPage';
import ProfilePage from './pages/ProfilePage';
import { isAuthenticated } from './services/auth';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        {isAuthenticated() && <Navbar />}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <PrivateRoute>
                <PatientsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-diagnosis"
            element={
              <PrivateRoute>
                <AiDiagnosisPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-sessions"
            element={
              <PrivateRoute>
                <AiSessionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
