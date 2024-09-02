import React, { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useUser } from '../hooks/Chat/useUser';
import { useChat } from '../hooks/Chat/useChat';
import { useMainButton } from '../hooks/Chat/useMainButton';

const Chat: React.FC = () => {
  const { chatId = "" } = useParams<{ chatId: string }>();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = React.useState<number>(0);

  const user = useUser();
  const { messages, isLoading, handleSubmit, setLoading } = useChat(chatId, user!);

  // Инициализация mainButton только на странице чата
  const mainButton = useMainButton(() => {
    if (messageInputRef.current) {
      handleSubmit(messageInputRef.current.value);
    }
  });

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            mainButton={mainButton} // Передаем mainButton
            sendPromptToServer={handleSubmit}
            isLoading={isLoading}
            onHeightChange={setFormHeight}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
