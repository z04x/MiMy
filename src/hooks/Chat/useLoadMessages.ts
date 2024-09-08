import { useEffect, useState } from "react";
import { loadMessages } from "./apiHooks";
import { Message } from "../../interfaces/Message";
import User from "../../interfaces/User";

export const useLoadMessages = (chatId: string, user: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMsgs = async () => {
      if (!chatId || !user) {
        // Если chatId или user не заданы, не выполняем запрос
        return;
      }

      setIsLoading(true); // Устанавливаем загрузку в true перед началом загрузки

      try {
        const response = await loadMessages(user.user_id, chatId);
        setModel(response.model);
        setMessages(response.messages.reverse());
      } catch (error: any) {
        if (error.response.status === 404) {
          setIsLoading(false);
          return;
        } else {
          console.error("Error fetching messages:", error);
          throw error;
        }
      } finally {
        setIsLoading(false); // Устанавливаем загрузку в false после завершения
      }
    };

    loadMsgs();
  }, [chatId, user]);

  return { messages, model, isLoading, setMessages, setIsLoading };
};
