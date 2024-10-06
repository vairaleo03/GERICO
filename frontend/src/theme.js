// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Verde Principale
    },
    secondary: {
      main: '#81C784', // Verde Chiaro
    },
    success: {
      main: '#81C784', // Verde per Successo
    },
    error: {
      main: '#E57373', // Rosso per Errori
    },
    background: {
      default: '#FFFFFF', // Bianco per lo sfondo
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)',
          boxShadow: '0 4px 2px -2px gray',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;
