// src/pages/LoginPage.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { login, setUser } from '../services/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      setUser(response.data.user); // Salva l'utente nel localStorage
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Credenziali non valide');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Accedi
        </Button>
      </form>
      <Typography variant="body1" style={{ marginTop: '1rem' }}>
        Non hai un account?{' '}
        <Link component={RouterLink} to="/register">
          Registrati qui
        </Link>
      </Typography>
    </Container>
  );
}

export default LoginPage;
