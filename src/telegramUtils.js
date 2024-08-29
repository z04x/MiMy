import { initBackButton } from '@telegram-apps/sdk';

// Инициализация Telegram Web App
export const initTelegram = async () => {
  try {
    // Инициализация кнопки "Назад"
    const [backButton] = await initBackButton(); // Предполагается, что это асинхронная функция
    backButton.show();
    console.log('Back button visible:', backButton.isVisible); // Проверяем видимость кнопки

    backButton.on('click', () => {
      console.log('Back button pressed');
      window.history.back(); // Возврат на предыдущую страницу
    });

    // Отключение вертикальных свайпов
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.disableVerticalSwipes();
    } else {
      console.error('Telegram WebApp is not available');
    }
  } catch (error) {
    console.error('Error initializing Telegram:', error);
  }
};
