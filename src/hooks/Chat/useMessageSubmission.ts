import { useCallback } from 'react';
import { Message } from '../../interfaces/Message';
import { getStreamResponse } from '../../services/dialogService';
import { handleMessageSubmission } from '../../utils/messageUtils';
import User from '../../interfaces/User';

export const useMessageSubmission = (chatId: string, user: User | null, setMessages: React.Dispatch<React.SetStateAction<Message[]>>, isLoading: boolean) => {

  // Обработка ошибок
    const handleError = useCallback((errorMessage: string) => {
    console.error(errorMessage);
    setMessages(prevMessages => {
        const updatedMessages = prevMessages.slice(0, -1); // Удаление последнего сообщения
        const errorMsg: Message = {
        text: `Error: ${errorMessage}`,
        isUser: false,
        };
        return [...updatedMessages, errorMsg];
    });
    }, [setMessages]);

  // Отправка сообщения
    const handleSubmit = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = { text: prompt, isUser: true };
    const loadingMessage: Message = { text: "", isUser: false, isLoading: true };

    setMessages(prevMessages => [...prevMessages, userMessage, loadingMessage]);

    if (user) {
        try {
            const numericChatId = Number(chatId);
            if (!isNaN(numericChatId)) {
                const dialogId = await handleMessageSubmission(user.id, prompt, numericChatId, setMessages);

            if (dialogId !== null) {
                const assistantResponse: Message = {
                    text: null,
                    isUser: false,
                    isLoading: true,
                    readPromptResponse: getStreamResponse(dialogId, prompt),
                };

            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages.pop();  // Удаление сообщения о загрузке
                return [...updatedMessages, assistantResponse];
            });
                } else {
                    handleError("Failed to get dialogId");
            }
        } else {
            handleError("Invalid chatId: it is not a number");
        }
    } catch (error) {
        handleError("An error occurred. Please try again later.");
        }
    } else {
        handleError("No user data available");
    }
    }, [user, chatId, setMessages, isLoading, handleError]);

return { handleSubmit };
};
