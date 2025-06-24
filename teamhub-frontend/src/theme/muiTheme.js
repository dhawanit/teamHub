// src/theme/muiTheme.js
import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize this as needed
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default muiTheme;
