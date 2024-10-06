// src/components/Login.js

import React, { useState, useContext } from 'react';
import axios from '../utils/axiosInstance';
import { TextField, Button, Container } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/auth/login', formData);
      await login(res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Credenziali non valide');
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={onChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={onChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Accedi
        </Button>
      </form>
      <p>
        Non hai un account?{' '}
        <Link to="/register">
          Registrati
        </Link>
      </p>
    </Container>
  );
}

export default Login;
