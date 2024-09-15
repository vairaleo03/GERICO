// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blu principale per l'ospedale
    },
    secondary: {
      main: '#00bfa5', // Verde menta per gli accenti
    },
    background: {
      default: '#f5f5f5', // Grigio chiaro per lo sfondo
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;