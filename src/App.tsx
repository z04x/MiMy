// src/App.tsx

import React, {useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import theme from './styles/theme';
import Chat from './components/Chat';
import ChatHistory from './components/ChatHistory';
import CreateChat from './components/CreateChat';
import { initTelegram } from './telegramUtils';


const App: React.FC = () => {
   useEffect(() => {
    initTelegram();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ bgcolor: 'background.default' }}>
        <Router>
          <Routes>
            <Route path="/chat/:chatId" Component={Chat} />
            <Route path="/chat-history" Component={ChatHistory} />
            <Route path="/create-chat" Component={CreateChat} />
            <Route path="/" Component={ChatHistory} />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
};

export default App;
