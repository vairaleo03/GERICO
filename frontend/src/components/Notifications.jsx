// src/components/Notifications.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Badge, IconButton, Menu, MenuItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AuthContext from '../context/AuthContext';
import axios from '../utils/axiosInstance';
import { subscribeToNotifications } from '../utils/socket';

function Notifications() {
  const { authState } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

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

  useEffect(() => {
    fetchNotifications();

    subscribeToNotifications((notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });
    // eslint-disable-next-line
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.length === 0 && (
          <MenuItem>Nessuna notifica</MenuItem>
        )}
        {notifications.map((notification, index) => (
          <MenuItem key={index} onClick={handleClose}>
            <ListItemText primary={notification.message} secondary={new Date(notification.timestamp).toLocaleString()} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default Notifications;
