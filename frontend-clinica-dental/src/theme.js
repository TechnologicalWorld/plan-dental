import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light', // o 'dark'
    primary: {
      main: '#1976d2', // azul dental
    },
    secondary: {
      main: '#00bcd4', // celeste
    },
    background: {
      default: '#f4f6f8', // gris claro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});
