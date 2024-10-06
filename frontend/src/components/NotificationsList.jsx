// src/components/NotificationsList.js

import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';

function NotificationsList() {
  const { authState } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/notifications', {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [authState.token]);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Notifiche Ricevute
      </Typography>
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification._id}>
            <ListItemText
              primary={notification.message}
              secondary={new Date(notification.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default NotificationsList;
