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
          const responsePromise = getStreamResponse(user.user_id, chatId, prompt);
          
          const assistantResponse: Message = {
            text: null,
            isUser: false,
            isLoading: true,
            readPromptResponse: responsePromise,
          };
          
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.pop(); // Удаление сообщения о загрузке
            return [...updatedMessages, assistantResponse];
          });

          const response = await responsePromise;
          
          if ('error' in response) {
            // Это случай ошибки 402
            setMessages((prevMessages) => {
              const updatedMessages = prevMessages.map(msg => 
                msg === assistantResponse ? { ...msg, text: response.error, isLoading: false } : msg
              );
              return updatedMessages;
            });
          }
        } catch (error) {
          handleError("Произошла ошибка. Пожалуйста, попробуйте еще раз позже.");
        }
      } else {
        handleError("Данные пользователя недоступны");
      }
    },
    [user, chatId, setMessages, isLoading, handleError, isNewChat]
  );

  return { handleSubmit };
};
