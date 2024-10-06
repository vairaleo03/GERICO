// src/components/Dashboard.js

import React, { useContext, useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import AuthContext from '../context/AuthContext';
import { subscribeToNotifications } from '../utils/socket';
import NeighborhoodSelector from './NeighborhoodSelector';
import BinMap from './BinMap';
import CollectionCentersMap from './CollectionCentersMap';
import RecyclingGuide from './RecyclingGuide';
import PickupForm from './PickupForm';
import MyPickups from './MyPickups';
import SpecialPickups from './SpecialPickups';

function Dashboard() {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    subscribeToNotifications((notification) => {
      enqueueSnackbar(notification.message, { variant: 'info' });

      // Gestione delle notifiche in base al tipo
      if (notification.type === 'bin_report') {
        // Implementa la logica per aggiornare le segnalazioni nella mappa
      } else if (notification.type === 'special_pickup') {
        // Implementa la logica per gestire le richieste di ritiro speciale
      }
    });
  }, [enqueueSnackbar]);

  if (!authState.user) {
    return <div>Caricamento...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Benvenuto, {authState.user.name}
      </Typography>
      <Grid container spacing={3}>
        {authState.user.role === 'service' && (
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <SpecialPickups />
            </Paper>
          </Grid>
        )}
        {/* Componenti per tutti gli utenti */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <NeighborhoodSelector />
          </Paper>
        </Grid>
        {authState.user.role === 'citizen' && (
          <>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <PickupForm />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <MyPickups />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <RecyclingGuide />
              </Paper>
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <BinMap />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <CollectionCentersMap />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
