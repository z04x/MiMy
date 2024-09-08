import { useCallback } from "react";
import { Message } from "../../interfaces/Message";
import { getStreamResponse } from "../../services/dialogService";
import { createChat } from "../../services/dialogService";
import User from "../../interfaces/User";

export const useMessageSubmission = (
  chatId: string,
  isNewChat: boolean,
  user: User | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  isLoading: boolean
) => {
  // Обработка ошибок
  const handleError = useCallback(
    (errorMessage: string) => {
      console.error(errorMessage);
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.slice(0, -1); // Удаление последнего сообщения
        const errorMsg: Message = {
          text: `Error: ${errorMessage}`,
          isUser: false,
        };
        return [...updatedMessages, errorMsg];
      });
    },
    [setMessages]
  );

  // Отправка сообщения
  const handleSubmit = useCallback(
    async (prompt: string, model: string) => {
      if (!prompt.trim() || isLoading) return;

      const userMessage: Message = { text: prompt, isUser: true };
      const loadingMessage: Message = {
        text: "",
        isUser: false,
        isLoading: true,
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        loadingMessage,
      ]);

      console.log("isNewChat", isNewChat);

      if (user) {
        try {
          if (isNewChat) {
            await createChat(user.user_id, model, chatId);
          }
          const assistantResponse: Message = {
            text: null,
            isUser: false,
            isLoading: true,
            readPromptResponse: getStreamResponse(user.user_id, chatId, prompt),
          };

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.pop(); // Удаление сообщения о загрузке
            return [...updatedMessages, assistantResponse];
          });
        } catch (error) {
          handleError("An error occurred. Please try again later.");
        }
      } else {
        handleError("No user data available");
      }
    },
    [user, chatId, setMessages, isLoading, handleError, isNewChat]
  );

  return { handleSubmit };
};
