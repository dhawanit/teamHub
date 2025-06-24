import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const drawerWidth = 240;
const collapsedWidth = 64;

const MainLayout = () => {
const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Box sx={{ display: 'flex', width: '100vw', overflowX: 'hidden' }}>
      {/* Sidebar */}
            <Sidebar open={sidebarOpen} toggleOpen={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarOpen ? drawerWidth : collapsedWidth}px`,
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
