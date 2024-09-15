// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ospedale XYZ
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} to="/patients">
          Pazienti
        </Button>
        <Button color="inherit" component={Link} to="/ai-diagnosis">
          Diagnosi AI
        </Button>
        <Button color="inherit" component={Link} to="/ai-sessions">
          Storico Diagnosi
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Profilo
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
