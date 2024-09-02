// src/App.tsx

import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import theme from './styles/theme';
import Chat from './components/Chat';
import ChatHistory from './components/ChatHistory';
import HomeScreen from './components/HomeScreen';
import UpgradePage from './components/UpgradePage';
import { initTelegram } from './telegramUtils';

const App: React.FC = () => {
  useEffect(() => {
    try {
      const isTelegramWebApp = window.Telegram?.WebApp || window.location !== window.parent.location;

      if (isTelegramWebApp) {
        // Инициализируем Telegram API только если приложение запущено внутри Telegram
        initTelegram();
      } else {
        console.warn('Приложение запущено вне Telegram. Пропуск инициализации Telegram API.');
      }
    } catch (error) {
      console.error('Ошибка при инициализации Telegram:', error);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ bgcolor: 'background.default', position:'fixed', bottom:0,left:0,width:'100%', height:'100%', overflow:'hidden'}}>
        <Router>
          <Routes>
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/chat-history" element={<ChatHistory />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/upgrade" element={<UpgradePage />} />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
};

export default App;
