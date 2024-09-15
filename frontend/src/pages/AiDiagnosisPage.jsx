// src/pages/AiDiagnosisPage.js
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Select, MenuItem, TextField, FormControl, InputLabel, Paper,
} from '@mui/material';
import api from '../services/api';

function AiDiagnosisPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [inputData, setInputData] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiagnosis = async () => {
    try {
      const response = await api.post('/ai/diagnosis', { patientId: selectedPatient, inputData });
      setAiResponse(response.data.aiResponse);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Diagnosi AI
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Seleziona Paziente</InputLabel>
        <Select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          label="Seleziona Paziente"
        >
          {patients.map((patient) => (
            <MenuItem key={patient._id} value={patient._id}>
              {patient.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Dati Clinici"
        margin="normal"
        multiline
        rows={4}
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleDiagnosis}
        sx={{ mt: 2 }}
        disabled={!selectedPatient || !inputData}
      >
        Ottieni Diagnosi
      </Button>
      {aiResponse && (
        <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Risposta dell'AI:
          </Typography>
          <Typography variant="body1">{aiResponse}</Typography>
        </Paper>
      )}
    </Container>
  );
}

export default AiDiagnosisPage;
