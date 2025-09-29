// Sidebar.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
} from '@mui/material';
import {
  Dashboard,
  People,
  CalendarToday,
  BarChart,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 280;
const miniDrawerWidth = 70;

export default function Sidebar({ open }) {
  const [openUsers, setOpenUsers] = useState(false);
  const handleToggleUsers = () => setOpenUsers(!openUsers);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : miniDrawerWidth,
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar />

      <List>
        {/* Dashboard */}
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItem>

        {/* Gestión de Usuarios */}
        <ListItem button onClick={handleToggleUsers}>
          <ListItemIcon>
            <People />
          </ListItemIcon>
          {open && <ListItemText primary="Gestión de Usuarios" />}
          {open && (openUsers ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>

        {open && (
          <Collapse in={openUsers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem button component={Link} to="/personal">
                <ListItemText primary="Personal" />
              </ListItem>
              <ListItem button component={Link} to="/pacientes">
                <ListItemText primary="Pacientes" />
              </ListItem>
              <ListItem button component={Link} to="/roles">
                <ListItemText primary="Roles y Permisos" />
              </ListItem>
            </List>
          </Collapse>
        )}

        {/* Calendarios */}
        <ListItem button component={Link} to="/calendarios">
          <ListItemIcon>
            <CalendarToday />
          </ListItemIcon>
          {open && <ListItemText primary="Calendarios" />}
        </ListItem>

        {/* Reportes */}
        <ListItem button component={Link} to="/reportes">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          {open && <ListItemText primary="Reportes" />}
        </ListItem>
      </List>
    </Drawer>
  );
}
