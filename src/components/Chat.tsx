import React, { useRef, useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useUser } from '../contexts/UserContext'; // Импортируйте useUser из контекста
import { useChat } from '../hooks/Chat/useChat';
import { useMainButton } from '../hooks/Chat/useMainButton';

const Chat: React.FC = () => {
  const { chatId = "" } = useParams<{ chatId: string }>();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");

  // Использование контекста для получения данных пользователя
  const { user, loading, error } = useUser(); // Получаем user, loading и error из контекста

  const { messages, isLoading, handleSubmit, setLoading } = useChat(chatId, user!);

  // Инициализация mainButton только на странице чата
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleMainButtonClick = useCallback(() => {
    if (inputValue.trim()) {
      handleSubmit(inputValue);
      setInputValue(""); // Очищаем значение после отправки
      if (messageInputRef.current) {
        messageInputRef.current.value = ""; // Очищаем поле ввода
      }
    }
  }, [inputValue, handleSubmit]);

  const mainButton = useMainButton(handleMainButtonClick);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error loading user data: {error}</div>;
  }

  if (!user) {
    return <div>User data is not available.</div>;
  }

  return (
    <Box sx={{ height: '100%', maxHeight: '100%' }}>
      <Box sx={{ display: "flex", flexDirection: "column", overflow: 'hidden', position: 'fixed', bottom: 0, left: 0 }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: '100%',
            position: 'fixed',
            overflow: 'hidden',
            bottom: 0,
            left: 0,
            pb: `${formHeight}px`,
          }}
        >
          <MessageList
            messages={messages}
            endOfMessagesRef={endOfMessagesRef}
            setLoading={setLoading}
          />
        </Box>
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', pl: 1, pr: 1 }}>
          <MessageInput
            ref={messageInputRef}
            mainButton={mainButton}
            sendPromptToServer={handleSubmit}
            isLoading={isLoading}
            onHeightChange={setFormHeight}
            value={inputValue}
            onChange={handleInputChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
