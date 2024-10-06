// src/components/MyPickups.js

import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import { Container, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';

function MyPickups() {
  const { authState } = useContext(AuthContext);
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ wasteType: '', scheduledDate: '' });

  useEffect(() => {
    const fetchPickups = async () => {
      try {
        const res = await axios.get('/pickups/my', {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        setPickups(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPickups();
  }, [authState.token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/pickups/pickup/${id}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setPickups(pickups.filter((pickup) => pickup._id !== id));
      alert('Prenotazione annullata con successo');
    } catch (err) {
      console.error(err);
      alert('Errore durante l\'annullamento della prenotazione');
    }
  };

  const handleEdit = (pickup) => {
    setSelectedPickup(pickup);
    setFormData({
      wasteType: pickup.wasteType,
      scheduledDate: pickup.scheduledDate.split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedPickup(null);
  };

  const handleFormSubmit = async () => {
    try {
      await axios.put(
        `/pickups/pickup/${selectedPickup._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      setPickups(
        pickups.map((pickup) =>
          pickup._id === selectedPickup._id
            ? { ...pickup, wasteType: formData.wasteType, scheduledDate: formData.scheduledDate }
            : pickup
        )
      );
      handleDialogClose();
      alert('Prenotazione modificata con successo');
    } catch (err) {
      console.error(err);
      alert('Errore durante la modifica della prenotazione');
    }
  };

  return (
    <Container>
      <h3>Le Mie Prenotazioni</h3>
      <ul>
        {pickups.map((pickup) => (
          <li key={pickup._id}>
            {pickup.wasteType} il {new Date(pickup.scheduledDate).toLocaleDateString()} - Stato: {pickup.status}
            {pickup.status === 'pending' && (
              <>
                <Button variant="text" color="primary" onClick={() => handleEdit(pickup)}>
                  Modifica
                </Button>
                <Button variant="text" color="secondary" onClick={() => handleDelete(pickup._id)}>
                  Annulla
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Modifica Prenotazione</DialogTitle>
        <DialogContent>
          <TextField
            label="Tipo di Rifiuto"
            name="wasteType"
            value={formData.wasteType}
            onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Data Programmata"
            name="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annulla</Button>
          <Button onClick={handleFormSubmit} color="primary">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyPickups;
