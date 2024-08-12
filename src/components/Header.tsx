// src/components/Header.tsx

import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link } from 'react-router-dom';

interface HeaderProps {
  chatId: string;
}

const Header: React.FC<HeaderProps> = ({ chatId }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton component={Link} to="/chat-history" edge="start" color="inherit" aria-label="menu">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chat Model {chatId}
        </Typography>
        <IconButton edge="end" color="inherit" aria-label="options">
          <MoreVertIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

