import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { initMainButton } from '@telegram-apps/sdk';

const UpgradePage: React.FC = () => {
  const [mainButton, setMainButton] = useState<any>(null);
  const navigate = useNavigate();

  const handlePurchaseClick = useCallback(() => {
    // Логика для покупки премиум-подписки
    alert("Покупка премиум-подписки не реализована в этом примере.");
  }, []);

  useEffect(() => {
    const initMainButtonAsync = async () => {
      try {
        const [button] = await initMainButton();
        console.log('MainButton:', button); // Логируем свойства кнопки для отладки
        if (button) {
          button.setParams({
            text: "Upgrade to Professional",
            isVisible: true,
          });
          button.setBgColor('#088C5D');
          button.on('click', handlePurchaseClick); // Убедитесь, что метод on существует

          setMainButton(button);
        }
      } catch (error) {
        console.error('Error initializing main button:', error);
      }
    };

    initMainButtonAsync();

    return () => {
      if (mainButton) {
        if (typeof mainButton.off === 'function') {
          mainButton.off('click', handlePurchaseClick); // Убедитесь, что метод off существует
        }
        if (typeof mainButton.hide === 'function') {
          mainButton.hide(); // Убедитесь, что метод hide существует
        }
      }
    };
  }, [handlePurchaseClick]);

  useEffect(() => {
    const backButton = window.Telegram?.WebApp?.BackButton;

    if (backButton) {
      console.log('BackButton:', backButton); // Логируем свойства кнопки для отладки
      if (typeof backButton.on === 'function') {
        const handleBackButtonClick = () => {
          if (mainButton) {
            if (typeof mainButton.hide === 'function') {
              mainButton.hide(); // Скрываем mainButton при клике на backButton
            }
          }
        };

        backButton.on('click', handleBackButtonClick);

        return () => {
          if (typeof backButton.off === 'function') {
            backButton.off('click', handleBackButtonClick);
          }
        };
      } else {
        console.error('BackButton does not support on method');
      }
    } else {
      console.error('BackButton is not available');
    }
  }, [mainButton]);

  return (
    <Box
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Upgrade to Premium
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Для доступа к этому функционалу вам необходимо оформить подписку на премиум-версию.
        Подписка дает доступ к эксклюзивным функциям и улучшенному обслуживанию.
      </Typography>
      <Button variant="contained" color="primary" onClick={handlePurchaseClick}>
        Купить Премиум
      </Button>
      <Button
        variant="text"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={() => navigate(-1)} // Возврат на предыдущую страницу
      >
        Назад
      </Button>
    </Box>
  );
};

export default UpgradePage;
