// src/pages/AiSessionsPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import api from '../services/api';
import { SocketContext } from '../context/SocketContext'; // Importa il contesto Socket

function AiSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const socket = useContext(SocketContext); // Usa il contesto Socket

  useEffect(() => {
    fetchSessions();

    // Ascolta gli eventi di nuova diagnosi
    socket.on('newDiagnosis', (newSession) => {
      console.log('Nuova diagnosi ricevuta:', newSession);
      // Aggiungi la nuova sessione in cima alla lista
      setSessions((prevSessions) => [newSession, ...prevSessions]);
    });

    // Cleanup all'unmount
    return () => {
      socket.off('newDiagnosis');
    };
  }, [socket]);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/ai/sessions');
      console.log('Sessioni AI ricevute:', response.data); // Debug
      setSessions(response.data);
    } catch (err) {
      console.error('Errore durante il recupero delle sessioni AI:', err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Storico Diagnosi AI
      </Typography>
      {sessions.length > 0 ? (
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Paziente</TableCell>
                <TableCell>Dati Clinici</TableCell>
                <TableCell>Risposta AI</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session._id}>
                  <TableCell>
                    {new Date(session.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{session.patient?.name || 'N/D'}</TableCell>
                  <TableCell>{session.inputData}</TableCell>
                  <TableCell>{session.aiResponse}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Typography variant="body1">Nessuna sessione AI trovata.</Typography>
      )}
    </Container>
  );
}

export default AiSessionsPage;
