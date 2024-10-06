// src/components/RecyclingGuide.js

import React, { useState, useContext } from 'react';
import axios from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import { TextField, List, ListItem, ListItemText, Container } from '@mui/material';

function RecyclingGuide() {
  const { authState } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/recyclingGuide?query=${query}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <h3>Guida al Riciclaggio</h3>
      <form onSubmit={handleSearch}>
        <TextField
          label="Cerca un oggetto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          margin="normal"
        />
      </form>
      {results.length > 0 && (
        <List>
          {results.map((item) => (
            <ListItem key={item._id}>
              <ListItemText
                primary={item.itemName}
                secondary={`${item.category}: ${item.disposalInstructions}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default RecyclingGuide;
