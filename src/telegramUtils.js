import { initBackButton } from '@telegram-apps/sdk';
import { BASE_URL } from './services/api';

export const initTelegram = async () => {
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
}
export const getTelegramUserData = () => {
  const user = window.Telegram.WebApp.initDataUnsafe.user;

  if (user) {
    console.log('User Info:', user);
    // console.log('User ID:', user.id);
    // console.log('User First Name:', user.first_name);
    // console.log('User Last Name:', user.last_name);
    // console.log('Username:', user.username);
    // console.log('Language Code:', user.language_code);

    return {
      user_id: user.id,
      username: user.username,
      full_name: `${user.first_name} ${user.last_name}`
    };
  } else {
    console.error('No user data available');
    return null;
  }
}
