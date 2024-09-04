import { useEffect, useState } from 'react';
import { loadMessages } from './apiHooks';
import { Message } from '../../interfaces/Message';
import User from '../../interfaces/User';

export const useLoadMessages = (chatId: string, user: User | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMsgs = async () => {
      if (chatId) {
        try {
          const numericChatId = parseInt(chatId, 10);
          const response = await loadMessages(user!.user_id, numericChatId);
          setMessages(response.reverse());
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMsgs();
  }, [chatId, user]);

  return { messages, isLoading, setMessages, setIsLoading };
};
