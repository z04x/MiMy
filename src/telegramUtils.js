import axios from 'axios';
import { initBackButton } from '@telegram-apps/sdk';

const API_BASE_URL = 'https://api.forgeaibot.com';

export const initTelegram = async () => {
  try {
    // Проверка доступности Telegram WebApp
    if (!window.Telegram?.WebApp) {
      console.error('Telegram WebApp is not available');
      return;
    }

    // Инициализация кнопки "Назад"
    const [backButton] = await initBackButton(); // Предполагается, что это асинхронная функция

    if (backButton) {
      backButton.show();
      console.log('Back button visible:', backButton.isVisible); // Проверяем видимость кнопки
      console.log('Back button info:', backButton);

      // Обработчик нажатия кнопки "Назад"
      backButton.on('click', () => {
        console.log('Back button pressed');
        window.history.back(); // Возврат на предыдущую страницу
      });
    } else {
      console.error('Back button could not be initialized');
    }

    // Отключение вертикальных свайпов
    window.Telegram.WebApp.disableVerticalSwipes();

    // Получение данных о пользователе
    const user = window.Telegram.WebApp.initDataUnsafe.user;

    if (user) {
      const userData = {
        user_id: user.id,
        username: user.username || '',
        full_name: `${user.first_name} ${user.last_name || ''}`.trim()
      };

      console.log('User information:', userData);

      // Проверка наличия пользователя на сервере
      await checkAndRegisterUser(userData);

    } else {
      console.error('User information is not available');
    }

  } catch (error) {
    console.error('Error initializing Telegram:', error);
  }
};

// Функция для проверки и регистрации пользователя
const checkAndRegisterUser = async (userData) => {
  try {
    // Проверка наличия пользователя
    const response = await axios.get(`${API_BASE_URL}/users/${userData.user_id}`);

    if (response.status === 200) {
      console.log('User exists on the server.');
    }
  } catch (error) {
    // Если пользователь не найден, регистрируем его
    if (error.response?.status === 404) {
      console.log('User not found. Registering...');
      await registerUser(userData);
    } else {
      console.error('Error checking user:', error);
    }
  }
};

// Функция для регистрации пользователя
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData);
    if (response.status === 200) {
      console.log('User registered successfully.');
    } else {
      console.error('Error registering user:', response);
    }
  } catch (error) {
    console.error('Error registering user:', error);
  }
};
