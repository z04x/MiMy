import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useUser } from '../contexts/UserContext'; 
import { useChat } from '../hooks/Chat/useChat';
import { useMainButton } from '../hooks/Chat/useMainButton';
const CHAT_STYLES = {
  container: { height: '100%', maxHeight: '100%', overflow: 'hidden' },
  innerContainer: { display: "flex", flexDirection: "column", width: '100%' },
  messageListContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
  },
  messageInputContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    pl: 1,
    pr: 1,
    width:'100%',
  }
};

const Chat: React.FC = () => {
  const { chatId = "" } = useParams<{ chatId: string }>();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const { user, loading } = useUser();
  // Используем useChat только если пользователь загружен
  const { messages, isLoading, handleSubmit, setLoading } = useChat(chatId, user!);

  const { setClickHandler, setEnabled } = useMainButton();

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleMainButtonClick = useCallback(async () => {
    if (inputValue.trim()) {
      try {
        await handleSubmit(inputValue);
        setInputValue("");
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      }
    }
  }, [inputValue, handleSubmit]);

  useEffect(() => {
    setClickHandler(handleMainButtonClick);
  }, [setClickHandler, handleMainButtonClick]);

  useEffect(() => {
    setEnabled(!!inputValue.trim());
  }, [inputValue, setEnabled]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const memoizedMessageList = useMemo(() => (
    <MessageList
      messages={messages}
      endOfMessagesRef={endOfMessagesRef}
      setLoading={setLoading}
    />
  ), [messages, endOfMessagesRef, setLoading]);

  const memoizedMessageInput = useMemo(() => (
    <MessageInput
      ref={messageInputRef}
      isLoading={isLoading}
      onHeightChange={setFormHeight}
      value={inputValue}
      onChange={handleInputChange}
    />
  ), [isLoading, inputValue, handleInputChange]);

  return (
    <>
      {loading && <div>Загрузка...</div>}
      {!loading && user && (
        <Box sx={CHAT_STYLES.container}>
          <Box sx={CHAT_STYLES.innerContainer}>
            <Box
              sx={{
                ...CHAT_STYLES.messageListContainer,
                pb: `${formHeight}px`,
              }}
            >
              {memoizedMessageList}
            </Box>
            <Box sx={CHAT_STYLES.messageInputContainer}>
              {memoizedMessageInput}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chat;
