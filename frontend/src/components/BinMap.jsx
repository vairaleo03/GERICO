// src/components/BinMap.js

import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@mui/material';
import binIconUrl from '../assets/bin.png';

function BinMap() {
  const { authState } = useContext(AuthContext);
  const [position] = useState([41.117143, 16.871871]); // Coordinate di Bari
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/report/bins', {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();

    // Aggiorna le segnalazioni ogni 30 secondi
    const interval = setInterval(fetchReports, 30000);

    return () => clearInterval(interval);
  }, [authState.token]);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    const userDescription = prompt('Inserisci una descrizione per la segnalazione:', 'Cassonetto pieno');
    if (userDescription === null) return; // L'utente ha annullato

    try {
      await axios.post(
        '/report/bin',
        { latitude: lat, longitude: lng, description: userDescription },
        {
          headers: { Authorization: `Bearer ${authState.token}` },
        }
      );
      alert('Segnalazione inviata con successo');

      // Aggiorna le segnalazioni per mostrare il nuovo marker
      const res = await axios.get('/report/bins', {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
      alert('Errore durante la segnalazione');
    }
  };

  // Icona personalizzata per i cassonetti pieni
  const binIcon = new L.Icon({
    iconUrl: binIconUrl,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
  });

  return (
    <div>
      <h3>Segnala Cassonetti Pieni</h3>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '400px' }}
        onClick={authState.user.role === 'citizen' ? handleMapClick : null}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {reports.map((report) => (
          <Marker
            key={report._id}
            position={[
              report.binLocation.coordinates[1],
              report.binLocation.coordinates[0],
            ]}
            icon={binIcon}
          >
            <Popup>
              <strong>Segnalato da:</strong> {report.user.name}
              <br />
              {report.description && (
                <>
                  <strong>Descrizione:</strong> {report.description}
                  <br />
                </>
              )}
              {authState.user.role === 'service' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    try {
                      await axios.put(
                        `/report/bin/${report._id}/resolve`,
                        {},
                        {
                          headers: { Authorization: `Bearer ${authState.token}` },
                        }
                      );
                      setReports(reports.filter((r) => r._id !== report._id));
                      alert('Segnalazione risolta');
                    } catch (err) {
                      console.error(err);
                      alert('Errore durante l\'aggiornamento della segnalazione');
                    }
                  }}
                >
                  Contrassegna come risolto
                </Button>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {authState.user.role === 'citizen' && (
        <p>Clicca sulla mappa per segnalare un cassonetto pieno.</p>
      )}
    </div>
  );
}

export default BinMap;
