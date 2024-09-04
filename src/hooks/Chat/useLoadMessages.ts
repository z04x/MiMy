import { useEffect, useState } from 'react';
import { loadMessages } from './apiHooks';
import { Message } from '../../interfaces/Message';
import User from '../../interfaces/User';

export const useLoadMessages = (chatId: string, user: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMsgs = async () => {
      if (!chatId || !user) {
        // Если chatId или user не заданы, не выполняем запрос
        return;
      }
      
      setIsLoading(true); // Устанавливаем загрузку в true перед началом загрузки

      try {
        const numericChatId = parseInt(chatId, 10);
        const response = await loadMessages(user.user_id, numericChatId);
        setMessages(response.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false); // Устанавливаем загрузку в false после завершения
      }
    };

    loadMsgs();
  }, [chatId, user]);

  return { messages, isLoading, setMessages, setIsLoading };
};