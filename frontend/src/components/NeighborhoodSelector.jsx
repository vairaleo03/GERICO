// src/components/NeighborhoodSelector.js

import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import { TextField, MenuItem, Container } from '@mui/material';

function NeighborhoodSelector() {
  const { authState } = useContext(AuthContext);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const res = await axios.get('/neighborhoods', {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        setNeighborhoods(res.data);
        if (authState.user.neighborhood) {
          setSelectedNeighborhood(authState.user.neighborhood);
          fetchSchedule(authState.user.neighborhood);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNeighborhoods();
    // eslint-disable-next-line
  }, [authState.token]);

  const fetchSchedule = async (neighborhoodName) => {
    try {
      const res = await axios.get(`/calendar/${neighborhoodName}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setSchedule(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = async (e) => {
    const neighborhoodName = e.target.value;
    setSelectedNeighborhood(neighborhoodName);
    fetchSchedule(neighborhoodName);
  };

  return (
    <Container>
      <TextField
        select
        label="Seleziona Quartiere"
        value={selectedNeighborhood}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {neighborhoods.map((n) => (
          <MenuItem key={n._id} value={n.name}>
            {n.name}
          </MenuItem>
        ))}
      </TextField>
      {schedule.length > 0 && (
        <div>
          <h3>Calendario Raccolta per {selectedNeighborhood}</h3>
          <ul>
            {schedule.map((item, index) => (
              <li key={index}>
                {item.day}: {item.wasteType}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

export default NeighborhoodSelector;
