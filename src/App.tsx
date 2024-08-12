// src/App.tsx

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import theme from './styles/theme';
import Chat from './components/Chat';
import ChatHistory from './components/ChatHistory';
import CreateChat from './components/CreateChat';

const App: React.FC = () => {
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
