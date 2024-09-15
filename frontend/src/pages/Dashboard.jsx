// src/pages/Dashboard.js
import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';

function Dashboard() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Benvenuto nella Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Totale Pazienti</Typography>
            <Typography variant="h3">120</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Diagnosi AI Effettuate</Typography>
            <Typography variant="h3">45</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
