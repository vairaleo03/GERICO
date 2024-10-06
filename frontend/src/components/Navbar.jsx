// src/components/Navbar.js

import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Notifications from './Notifications';

function Navbar() {
  const { authState, logout } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          RecycleSmart
        </Typography>
        {authState.user ? (
          <>
            <Button color="inherit" component={Link} to="/">
              Dashboard
            </Button>
            {authState.user.role === 'service' && (
              <>
                <Button color="inherit" component={Link} to="/special-pickups">
                  Richieste di Ritiro
                </Button>
                <Notifications />
              </>
            )}
            <Typography variant="subtitle1" style={{ marginLeft: '1rem' }}>
              Ciao, {authState.user.name}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Registrati
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
