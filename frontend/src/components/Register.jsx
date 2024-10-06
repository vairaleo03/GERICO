// src/components/Register.js

import React, { useState } from 'react';
import axios from '../utils/axiosInstance';
import { TextField, Button, Container, MenuItem } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    role: 'citizen',
    name: '',
    email: '',
    password: '',
    neighborhood: '',
  });
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Errore durante la registrazione');
    }
  };

  return (
    <Container>
      <h2>Registrazione</h2>
      <form onSubmit={onSubmit}>
        <TextField
          select
          label="Ruolo"
          name="role"
          value={formData.role}
          onChange={onChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="citizen">Cittadino</MenuItem>
          <MenuItem value="service">Servizio di Raccolta</MenuItem>
        </TextField>
        <TextField
          label="Nome"
          name="name"
          value={formData.name}
          onChange={onChange}
          fullWidth
          margin="normal"
        />
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
        {formData.role === 'citizen' && (
          <TextField
            label="Quartiere"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={onChange}
            fullWidth
            margin="normal"
          />
        )}
        <Button type="submit" variant="contained" color="primary">
          Registrati
        </Button>
      </form>
      <p>
        Hai già un account?{' '}
        <Link to="/login">
          Accedi
        </Link>
      </p>
    </Container>
  );
}

export default Register;
