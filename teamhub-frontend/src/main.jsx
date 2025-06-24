import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { muiTheme, GlobalStyles } from './theme';

// 🔁 Add these imports
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MuiThemeProvider theme={muiTheme}>
      <StyledThemeProvider theme={muiTheme}>
        <GlobalStyles />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </StyledThemeProvider>
    </MuiThemeProvider>
  </React.StrictMode>
);
