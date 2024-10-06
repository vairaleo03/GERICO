// src/components/PickupForm.js

import React, { useState, useContext } from 'react';
import axios from '../utils/axiosInstance';
import { TextField, Button, Snackbar } from '@mui/material';
import AuthContext from '../context/AuthContext';

function PickupForm() {
  const [formData, setFormData] = useState({
    wasteType: '',
    scheduledDate: '',
  });
  const { authState } = useContext(AuthContext);

  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validazione dei campi
    if (!formData.wasteType || !formData.scheduledDate) {
      setSnackbar({ open: true, message: 'Per favore, compila tutti i campi' });
      return;
    }

    try {
      await axios.post('/pickups/pickup', formData, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setSnackbar({ open: true, message: 'Prenotazione effettuata con successo' });

      // Resetta il modulo dopo la prenotazione
      setFormData({
        wasteType: '',
        scheduledDate: '',
      });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Errore durante la prenotazione' });
    }
  };

  return (
    <div>
      <h3>Prenota un Ritiro Speciale</h3>
      <form onSubmit={onSubmit}>
        <TextField
          label="Tipo di Rifiuto"
          name="wasteType"
          value={formData.wasteType}
          onChange={onChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Data Programmata"
          name="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={onChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Prenota
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </div>
  );
}

export default PickupForm;
