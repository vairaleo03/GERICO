// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import { register } from '../services/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      alert('Registrazione effettuata con successo');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Errore durante la registrazione');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Registrazione</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nome"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          Registrati
        </Button>
      </form>
      <Typography variant="body1" style={{ marginTop: '1rem' }}>
        Hai già un account?{' '}
        <Link component={RouterLink} to="/">
          Accedi qui
        </Link>
      </Typography>
    </Container>
  );
}

export default RegisterPage;
