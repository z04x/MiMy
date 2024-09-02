// theme.ts

import { createTheme } from '@mui/material/styles';
import Gala from '../assets/images/galactic_stars.png';

// Расширяем типы для кнопок
import '@mui/material/Button'; // Убедитесь, что это импортировано

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#1F2322',
      paper: '#2C302F',
    },
    colors: {
      default: '#FFFFFF17',
      paper: '#088C5D',
      customBgBtn: '#FFFAFA',
      gray: '#DDDDDD',
    },
    custom: {
      inputBg: '#171A19',
      sendBg: '#0AA66E',
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
            borderRadius: '36px',
            border: '1px solid #383939',
            backgroundColor: '#171A19',
            color: '#fff',
            '& fieldset': {
              border: '1px solid #383939',
            },
            '&:hover fieldset': {
              border: '1px solid #383939',
            },
            '&.Mui-focused fieldset': {
              border: '1px solid #383939',
            },
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'text' },
          style: {
            position: 'relative',
            textTransform: 'none',
            boxShadow: 'none',
            marginBottom: '16px',
            width: '100%',
            maxHeight: '104px',
            height: '100%',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF0F',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${Gala})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              zIndex: 0,
            },
            '& > *': {
              position: 'relative',
              zIndex: 1,
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            position: 'relative',
            textTransform: 'none',
            boxShadow: 'none',
            marginBottom: '16px',
            width: '100%',
            maxHeight: '104px',
            height: '100%',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF0F',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${Gala})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              transform: 'rotate(180deg)',
              zIndex: 0,
            },
            '& > *': {
              position: 'relative',
              zIndex: 1,
            },
          },
        },
      ],
    },
  },
});

export default theme;
