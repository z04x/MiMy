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
);

api.interceptors.response.use(
  (response) => {
    console.log('Получен ответ:', response);
    return response;
  }
);

export default api;
