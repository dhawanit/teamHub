import React from 'react';
import { Box, Typography } from '@mui/material';

const GreetingBanner = () => {
  // Replace with real user data from context or API
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold">
        Hello, {userName} 👋
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Welcome to Team Hub
      </Typography>
    </Box>
  );
};

export default GreetingBanner;
