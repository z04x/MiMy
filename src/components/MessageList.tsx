import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Message } from "../interfaces/Message";
import MessageComponent from "../components/messages/Message";
import { ModelDetails } from "../interfaces/ModelDetails";

interface MessageListProps {
  messages: Message[];
  endOfMessagesRef: React.RefObject<HTMLDivElement>;
  setLoading: (isLoading: boolean) => void;
  modelDetails: ModelDetails | null;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  endOfMessagesRef,
  setLoading,
  modelDetails,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Function to check if user is at the bottom
  const checkIfAtBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
    }
  };

  // Scroll to the bottom with a slight delay
  const scrollToBottom = () => {
    setTimeout(() => {
      const container = messageContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100); // Adjust delay as needed (e.g., 100 milliseconds)
  };

  // Scroll to bottom on initial load
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Handle scrolling for new messages and check if user is at bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  // Continuously check if user is at the bottom
  useEffect(() => {
    const container = messageContainerRef.current;
    let intervalId: NodeJS.Timeout | null = null;

    if (container) {
      intervalId = setInterval(() => {
        checkIfAtBottom();
      }, 100); // Adjust interval as needed (e.g., 100 milliseconds)
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Check if user is at the bottom on scroll
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfAtBottom);
      return () => {
        container.removeEventListener("scroll", checkIfAtBottom);
      };
    }
  }, []);

  return (
    <Box
      ref={messageContainerRef}
      sx={{
        mt: 1,
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRadius: 0,
        p: 2,
        backgroundColor: "background.default",
        paddingBottom: '10px', // Additional padding for input
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: "#fff",
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
        <>
          {messages.map((message, index) => (
            <MessageComponent
              key={index} // Ensure a unique key if possible
              message={message}
              index={index}
              setLoading={setLoading}
            />
          ))}
          {/* Reference to scroll into view can be useful for new messages */}
          <div ref={endOfMessagesRef} />
        </>
      ) : modelDetails ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          padding: 2, 
          backgroundColor: 'background.default', 
          borderRadius: 2,
          color: 'white',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Avatar src={modelDetails.logo_url} alt={modelDetails.label} 
              sx={{borderRadius:'0px', width: 24, height: 24, marginRight: 1, backgroundColor: 'inherit' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {modelDetails.label}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 2 }}>
            {modelDetails.short_description}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            {modelDetails.description}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'background.paper', 
            borderRadius: 1,
            padding: 1,
            width: '100%'
          }}>
            {/* <Avatar src={modelDetails.logo_url} alt={modelDetails.label} 
              sx={{borderRadius:'0px', width: 24, height: 24, marginRight: 1, backgroundColor: 'inherit' }} /> */}
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {modelDetails.preview_message}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography variant="body1">Загрузка деталей модели...</Typography>
      )}
    </Box>
  );
};

export default MessageList;
