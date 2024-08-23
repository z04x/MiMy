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
      default: '#1F2322', //  основной фон всего приложения
      paper: '#2C302F', // фон для компонентов в главном меню
    },
    colors: {
      default: '#333736', // фон для сообщений от чата 
      paper: '#DADADA', // фон для сообщений от пользователя
      customBgBtn: '#FFFAFA', //
      gray: 'DDDDE4',
    },
  },

  typography: {
    fontFamily: '"SFProText" sans-serif'
  },
});

export default theme;