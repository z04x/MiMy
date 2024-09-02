import { useLoadMessages } from './useLoadMessages';
import { useMessageSubmission } from './useMessageSubmission';
import User from '../../interfaces/User';

export const useChat = (chatId: string, user: User) => {
  const { messages, isLoading, setMessages, setIsLoading } = useLoadMessages(chatId, user);
  const { handleSubmit } = useMessageSubmission(chatId, user, setMessages, isLoading);

  return { messages, isLoading, handleSubmit, setLoading: setIsLoading };
};

