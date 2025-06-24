
import React, { useState } from 'react';
import { Box } from '@mui/material';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box display="flex">
      <Box flex={1}>
        <Box p={2}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
