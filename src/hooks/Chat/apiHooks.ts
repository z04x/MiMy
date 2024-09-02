import { initUser } from "../../services/userService";
import { getMessagesFromDialog } from "../../services/dialogService";
import User from "../../interfaces/User";
import { Message } from "../../interfaces/Message";

export const fetchUserData = async (): Promise<User> => {
  try {
    return await initUser();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const loadMessages = async (userId: number, dialogId: number): Promise<Message[]> => {
  try {
    return await getMessagesFromDialog(userId, dialogId);
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
