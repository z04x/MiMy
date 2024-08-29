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
      default: '#1F2322', // основной фон всего приложения
      paper: '#2C302F', // фон для компонентов в главном меню
    },
    colors: {
      default: '#FFFFFF17', // фон для сообщений от чата
      paper: '#088C5D', // фон для сообщений от пользователя
      customBgBtn: '#FFFAFA', // фон для кнопок
      gray: '#DDDDDD', // исправил ошибку в коде цвета
      
    },
     custom: {
      inputBg:'#171A19',
      sendBg:'#0AA66E'
    },
  },
  
  typography: {
    fontFamily: '"SFProText", sans-serif',
  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '36px', // Скругление углов
            border:'1px solid #383939',
            backgroundColor: '#171A19', // Фоновый цвет
            color:'#fff',
            '& fieldset': {
              border:'1px solid #383939'
            },
            '&:hover fieldset': {
              border:'1px solid #383939',
            },
            '&.Mui-focused fieldset': {
              border:'1px solid #383939',
            },
          },
        },
      },
    },
  },
});

export default theme;
