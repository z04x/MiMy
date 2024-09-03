import axios from "axios";

export const BASE_URL = "https://api.forgeaibot.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Добавляем перехватчики для запросов и ответов
api.interceptors.request.use(
  (config) => {
    console.log('Отправка запроса:', config);
    return config;
  },
  (error) => {
    console.error('Ошибка при отправке запроса:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Получен ответ:', response);
    return response;
  },
  (error) => {
    console.error('Ошибка ответа:', error);
    if (error.response) {
      console.error('Данные ответа:', error.response.data);
      console.error('Статус ответа:', error.response.status);
    } else if (error.request) {
      console.error('Запрос был сделан, но ответ не получен:', error.request);
    } else {
      console.error('Ошибка при настройке запроса:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
