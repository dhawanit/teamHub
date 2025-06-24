import React from 'react';
import { Box } from '@mui/material';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box
        sx={{
          width: 250,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: 3,
          height: '95vh',
          ml: 2,
          mt: 2,
          position: 'sticky',
          top: '16px'
        }}
      >
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
