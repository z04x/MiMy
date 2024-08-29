import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Message } from "../interfaces/Message";
import User from "../interfaces/User";
import {
  getMessagesFromDialog,
  getStreamResponse,
  createChat,
} from "../services/dialogService";
import { getUser } from "../services/userService";
import { initMainButton } from "@telegram-apps/sdk";

const Chat: React.FC = () => {
  const { chatId = "" } = useParams<{ chatId: string }>();
  const [mainButton] = initMainButton();
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Move into MessagesList
  const [isLoading, setIsLoading] = useState(false); // Move into MessagesList
  const [user, setUser] = useState<User | null>(null); // Is it needed? Probably, should be a prop or Context
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null); // Is it needed?
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null); // Is it needed?

  useEffect(() => { // Is it needed?
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {  // Move into MessagesList
    const loadMessages = async () => {
      if (selectedChatId || chatId) {
        const dialogId = selectedChatId || parseInt(chatId, 10);
        try {
          const response = await getMessagesFromDialog(dialogId);
          setMessages(response.reverse());
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    loadMessages();
  }, [selectedChatId, chatId]);

  const handleSubmit = async (prompt: string) => { // Split into two functions
    if (!prompt.trim()) return;

    const userMessage: Message = { text: prompt, isUser: true };
    const loadingMessage: Message = {
      text: "",
      isUser: false,
      isLoading: true,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);

    if (user) {
      try {
        let dialogId = selectedChatId || (chatId ? parseInt(chatId) : null);

        if (!dialogId) {
          dialogId = await createChat(Number(user.id), "gpt-4o-mini");
          setSelectedChatId(dialogId);
        }

        if (dialogId !== null) {
          const assistantResponse: Message = {
            text: null,
            isUser: false,
            isLoading: true,
            readPromptResponse: getStreamResponse(dialogId, prompt),
          };

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.pop();
            return [...updatedMessages, assistantResponse];
          });
        }
      } catch (error) {
        console.error("Error handling message submission:", error);
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.slice(0, -1);
          const errorMessage: Message = {
            text: "An error occurred. Please try again later.",
            isUser: false,
          };
          return [...updatedMessages, errorMessage];
        });
      }
    } else {
      console.error("No user data available");
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.slice(0, -1);
        const errorMessage: Message = {
          text: "Error: user data not found.",
          isUser: false,
        };
        return [...updatedMessages, errorMessage];
      });
    }
  };

  useEffect(() => {
    if (mainButton) {
      mainButton.setText("Send");
      mainButton.show();

      // Set up the button parameters
      mainButton.setParams({
        text: "Send ->",
        isVisible: true,
      });

      console.log("MainButton effect added");
      mainButton.on("click", () => {
        if (messageInputRef.current) {
          console.log(messageInputRef.current.value);
        }
      });

      // Simulate button click handling by polling
      // const interval = setInterval(() => {
      //   if (mainButton.isEnabled) {
      //     handleSubmit();
      //   }
      // });

      return () => {
        // clearInterval(interval);
        mainButton.hide();
      };
    }
  });

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          overflowY: "auto",
        }}
      >
        <MessageList
          setLoading={setIsLoading}
          messages={messages}
          endOfMessagesRef={endOfMessagesRef}
        />
        <Box sx={{ height: "10px" }} ref={endOfMessagesRef} />
      </Box>
      <MessageInput
        ref={messageInputRef}
        mainButton={mainButton}
        sendPromptToServer={(prompt: string) => {
          handleSubmit(prompt); // Call the handleSubmit function
        }}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Chat;
