// src/components/Navbar.jsx
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar({ userName = 'Esther', toggleSidebar }) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <LocalHospitalIcon />
          <Typography variant="h6">Clínica Dental</Typography>
        </Box>
        <Typography variant="body1">👤 {userName}</Typography>
      </Toolbar>
    </AppBar>
  );
}

