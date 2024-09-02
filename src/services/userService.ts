import api from "./api";
import { getTelegramUserData } from "../telegramUtils";

export const initUser = async () => {
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
      return res.data;
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
        return res.data;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error during user initialization:", error);
  }
};
