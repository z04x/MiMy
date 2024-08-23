import { initBackButton } from '@telegram-apps/sdk';

export const initTelegram = () => {
  // Инициализация кнопки "Назад"
  const [backButton] = initBackButton();
backButton.show();
console.log(backButton.isVisible); // true  
  backButton.on('click', () => {
    console.log('Back button pressed');
    window.history.back(); // Возврат на предыдущую страницу
  });
};
