// telegramUtils.ts

interface TelegramWebApp {
    init: () => void;

}

declare global {
    interface Window {
        Telegram?: {
            WebApp?: TelegramWebApp;
        };
    }
}

export const initTelegram = () => {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.init();
    } else {
        console.error('Telegram WebApp SDK is not loaded.');
    }
};