import api from "./api";
import { getTelegramUserData } from "../telegramUtils";

let cachedUser: any = null; // Кэш для данных о пользователе

export const initUser = async () => {
  // Проверка наличия кэшированных данных
  if (cachedUser) {
    console.log("Returning cached user data:", cachedUser);
    return cachedUser;
  }

  try {
    // Получаем данные пользователя из Telegram
    const telegramUserData = getTelegramUserData();

    if (!telegramUserData) {
      throw new Error("No user data from Telegram.");
    }

    const { user_id, username, full_name } = telegramUserData;

    // Пытаемся получить пользователя с сервера
    console.log(`Fetching user data from server for user_id: ${user_id}`);
    
    try {
      const res = await api.get(`/users/${user_id}`);
      console.log("User fetched from server:", res.data);
      cachedUser = res.data; // Сохраняем данные в кэш
      return cachedUser;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log("User not found, creating a new user...");

        // Данные нового пользователя
        const newUser = {
          user_id: user_id,
          username: username,
          full_name: full_name
        };

        // Создаем нового пользователя на сервере
        const res = await api.post("/users", newUser);
        console.log("User created on server:", res.data);
        cachedUser = res.data; // Сохраняем данные в кэш
        return cachedUser;
      } else {
        console.error("Error fetching or creating user:", error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Error during user initialization:", error);
    throw error; // Можно пробросить ошибку выше, если это нужно
  }
};
