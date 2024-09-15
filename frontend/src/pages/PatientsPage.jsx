// src/pages/PatientsPage.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Paper,
} from '@mui/material';
import { Add, Edit } from '@mui/icons-material';
import api from '../services/api';

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [open, setOpen] = useState(false);
  const [patientData, setPatientData] = useState({ name: '', age: '', medicalHistory: '' });

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpen = () => {
    setPatientData({ name: '', age: '', medicalHistory: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      await api.post('/patients', patientData);
      fetchPatients();
      handleClose();
    } catch (err) {
      console.error('Errore durante il salvataggio del paziente:', err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Errore: ${err.response.data.message}`);
      } else {
        alert('Errore durante il salvataggio del paziente');
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestione Pazienti
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={handleOpen} sx={{ mb: 2 }}>
        Aggiungi Paziente
      </Button>
      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Età</TableCell>
              <TableCell>Storia Medica</TableCell>
              <TableCell>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.medicalHistory}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  {/* Puoi aggiungere funzionalità di modifica ed eliminazione */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog per aggiungere/modificare paziente */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Aggiungi Paziente</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome"
            margin="normal"
            value={patientData.name}
            onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Età"
            margin="normal"
            type="number"
            value={patientData.age}
            onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
          />
          <TextField
            fullWidth
            label="Storia Medica"
            margin="normal"
            multiline
            rows={4}
            value={patientData.medicalHistory}
            onChange={(e) => setPatientData({ ...patientData, medicalHistory: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salva
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default PatientsPage;
