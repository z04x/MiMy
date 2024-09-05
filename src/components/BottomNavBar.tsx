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
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        height: '64px',
        backgroundColor: 'background.default',
        '& .MuiBottomNavigationAction-root': {
          color: '#888',
          minWidth: 'auto',
          padding: '6px 0',
          '&.Mui-selected': {
            color: 'white',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem', // Фиксированный размер иконок
            transition: 'none', // Отключаем анимацию перехода
          },
        },
      }}
    >
      <BottomNavigationAction
        label="Home"
        value="/"
        icon={<HomeIcon />}
        showLabel={true} // Всегда показывать метку
      />
      <BottomNavigationAction
        label="History"
        value="/chat-history"
        icon={<HistoryIcon />}
        showLabel={true}
      />
      <BottomNavigationAction
        label="Account"
        value="/account"
        icon={<AccountCircleIcon />}
        showLabel={true}
        disabled
      />
    </BottomNavigation>
  );
};

export default BottomNavBar;
