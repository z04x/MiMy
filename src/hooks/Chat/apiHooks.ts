import { initUser } from "../../services/userService";
import { getMessagesFromDialog } from "../../services/dialogService";
import User from "../../interfaces/User";
import { Message } from "../../interfaces/Message";

let cachedUser: User | null = null;

export const fetchUserData = async (): Promise<User> => {
  if (cachedUser) {
    return cachedUser;
  }

  try {
    const user = await initUser();
    cachedUser = user;
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const loadMessages = async (userId: number, dialogId: string): Promise<{ messages: Message[], model: string }> => {
  try {
    const { messages, model } = await getMessagesFromDialog(userId, dialogId);
    return { messages, model };
  } catch (error) {
    // console.error("Ошибка при получении сообщений:", error);
    throw error;
  }
};
