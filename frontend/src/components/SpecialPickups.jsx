// src/components/SpecialPickups.jsx

import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import { Container, Button, List, ListItem, ListItemText } from '@mui/material';

function SpecialPickups() {
  const { authState } = useContext(AuthContext);
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await axios.get('/pickups/all', {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        setPickups(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPickups();
  }, [authState.token]);

  const handleComplete = async (id) => {
    try {
      await axios.put(
        `/pickups/pickup/${id}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setPickups(pickups.filter((pickup) => pickup._id !== id));
      alert('Ritiro contrassegnato come completato');
    } catch (err) {
      console.error(err);
      alert('Errore durante l\'aggiornamento del ritiro');
    }
  };

  return (
    <Container>
      <h3>Richieste di Ritiro Speciale</h3>
      {pickups.length === 0 ? (
        <p>Nessuna richiesta di ritiro speciale al momento.</p>
      ) : (
        <List>
          {pickups.map((pickup) => (
            <ListItem key={pickup._id}>
              <ListItemText
                primary={`${pickup.wasteType} richiesto da ${pickup.citizen?.name || 'utente sconosciuto'}`}
                secondary={`Data richiesta: ${new Date(pickup.scheduledDate).toLocaleDateString()}`}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleComplete(pickup._id)}
              >
                Contrassegna come completato
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default SpecialPickups;
