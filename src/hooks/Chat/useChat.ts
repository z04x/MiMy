import { useLoadMessages } from "./useLoadMessages";
import { useMessageSubmission } from "./useMessageSubmission";
import User from "../../interfaces/User";

export const useChat = (chatId: string, user: User) => {
  const { messages, model, isLoading, setMessages, setIsLoading } =
    useLoadMessages(chatId, user);
  const { handleSubmit } = useMessageSubmission(
    chatId,
    messages.length === 0,
    user,
    setMessages,
    isLoading
  );

  return { messages, model, isLoading, handleSubmit, setLoading: setIsLoading };
};
