import React, { useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useRef } from "react";
import { Message } from "../interfaces/Message";
import MessageComponent from "./Message";

interface MessageListProps {
  messages: Message[];
  endOfMessagesRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  endOfMessagesRef,
}) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("Messages changed");
    // Scroll to bottom when messages change
    const scrollToBottom = () => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // MutationObserver to detect when new messages are rendered
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          scrollToBottom();
        }
      }
    });

    const container = messageContainerRef.current;
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
    }

    // Cleanup
    return () => {
      if (container) {
        observer.disconnect();
      }
    };
  }, [messages, endOfMessagesRef]);

  return (
    <Box
      ref={messageContainerRef}
      sx={{
        mb: 4,
        height: "70vh",
        overflowY: "auto",
        borderRadius: "10px",
        p: 0,
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages?.length > 0 ? (
        messages.map((message, index) => (
          <ul key={index}>
            <MessageComponent message={message} index={index} />
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
