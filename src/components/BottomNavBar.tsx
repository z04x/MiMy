// src/components/BottomNavBar.tsx

import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

const BottomNavBar: React.FC<{ current: string }> = ({ current }) => {
  const navigate = useNavigate();

  return (
    <BottomNavigation
      value={current}
      onChange={(event, newValue) => {
        navigate(newValue);
      }}
      sx={{ position: 'fixed', bottom: 0, width: '100%'}}
    >
      <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
      <BottomNavigationAction label="History" value="/chat-history" icon={<HistoryIcon />} />
      <BottomNavigationAction label="Account" value="/account" icon={<AccountCircleIcon />} disabled />
    </BottomNavigation>
  );
};

export default BottomNavBar;
