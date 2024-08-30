import { createChat } from "../services/dialogService";
import { Message } from "../interfaces/Message";

export const handleMessageSubmission = async (
  userId: number,
  prompt: string,
  chatId: number,  // Убедитесь, что это число
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
): Promise<number> => {
  let dialogId = chatId;

  if (!dialogId) {
    dialogId = await createChat(userId, "gpt-4o-mini");
  }

  return dialogId;
};
