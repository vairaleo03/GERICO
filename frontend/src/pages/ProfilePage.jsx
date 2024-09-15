// src/pages/ProfilePage.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import { getUser } from '../services/auth';

function ProfilePage() {
  const user = getUser();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profilo Utente
      </Typography>
      <Typography variant="h6">Nome: {user.name}</Typography>
      <Typography variant="h6">Email: {user.email}</Typography>
    </Container>
  );
}

export default ProfilePage;
