
// src/components/Layout.jsx
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

const drawerWidth = 240;
const miniDrawerWidth = 60;

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar open={sidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: sidebarOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`,
          marginTop: '64px',
          transition: 'margin 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
