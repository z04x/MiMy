import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
     background: {
      default: '#141718', // 
      paper: '#232627', // 
    },
    colors: {
      default: '#141718', // 
      paper: '#232627', // 
      customBgBtn: '#FFFAFA', //
      gray: 'DDDDE4',
    },
  },

  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;