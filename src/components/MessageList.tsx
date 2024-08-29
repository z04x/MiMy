import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Message } from "../interfaces/Message";
import MessageComponent from "./Message";

interface MessageListProps {
  messages: Message[];
  endOfMessagesRef: React.RefObject<HTMLDivElement>;
  setLoading: (isLoading: boolean) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  endOfMessagesRef,
  setLoading,
}) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      // Scroll to the bottom
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={messageContainerRef}
      sx={{
        mt: 1, 
        width: '100%',
        height: '100%',
        overflowY: "auto",
        borderRadius: "0px",
        p: 1,
        backgroundColor: "background.default",
        paddingBottom: '10px', // Additional padding for input
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: "#363D40",
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: "#535E61",
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: "#262120",
          borderRadius: '4px',
        },
      }}
    >
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <ul key={index}>
            <MessageComponent
              setLoading={setLoading}
              message={message}
              index={index}
            />
          </ul>
        ))
      ) : (
        <Typography variant="body1">No messages</Typography>
      )}
      <div ref={endOfMessagesRef} />
    </Box>
  );
};

export default MessageList;
