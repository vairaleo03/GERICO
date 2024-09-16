// src/pages/LoginPage.js
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Link, CircularProgress } from '@mui/material';
import { login, setUser } from '../services/auth';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Reset any previous error

    try {
      const response = await login(email, password);
      setUser(response.data.user); // Salva l'utente nel localStorage
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMessage('Credenziali non valide. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Accedi'}
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

