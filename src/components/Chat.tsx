import React, { useState, useEffect, useRef, FormEvent } from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "./Header";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
// import ChatList from './ChatList';

import { Message } from "../interfaces/Message";
import { User } from "../interfaces/User";

const BASE_URL = "http://localhost:3333";

const Chat: React.FC = () => {
  const { chatId = "" } = useParams<{ chatId: string }>();
  const [prompt, setPrompt] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } else {
          const res = await axios.get<User>(`${BASE_URL}/users/123`);
          const newUser: User = res.data;
          localStorage.setItem("user", JSON.stringify(newUser));
          setUser(newUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Load messages when chatId or selectedChatId changes
    const loadMessages = async () => {
      if (selectedChatId || chatId) {
        const dialogId = selectedChatId || parseInt(chatId, 10);
        try {
          const response = await getMessagesFromDialog(dialogId);
          setMessages(response.reverse());
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    loadMessages();
  }, [selectedChatId, chatId]);

  const createNewDialog = async (userId: number, model: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/dialogs/`, {
        user_id: userId,
        model: model,
      });
      return response.data.dialog_id;
    } catch (error) {
      console.error("Error creating new dialog:", error);
      throw error;
    }
  };

  const addMessageToDialog = async (dialogId: number, prompt: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/dialogs/${dialogId}/messages/`,
        {
          prompt: prompt,
        },
        {
          responseType: "stream",
        }
      );

      const stream = response.data;
      let result = "";
      stream.on("data", (chunk: any) => {
        console.log(chunk.toString());
        result += chunk.toString();
      });

      stream.on("end", () => {
        console.log("Stream ended");
      });

      return result;
    } catch (error) {
      console.error("Error adding message to dialog:", error);
      throw error;
    }
  };

  const getMessagesFromDialog = async (dialogId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/dialogs/${dialogId}/messages/`
      );
      return response.data.map((message: any) => ({
        text: message.content,
        isUser: message.role === "user",
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching messages from dialog:", error);
      throw error;
    }
  };

  const getStreamResponse = async (dialogId: number, prompt: string) => {
    const response = await fetch(`${BASE_URL}/dialogs/${dialogId}/messages/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    return response
      .body!.pipeThrough(new TextDecoderStream())
      .getReader();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    const userMessage: Message = { text: prompt, isUser: true };
    const loadingMessage: Message = {
      text: "",
      isUser: false,
      isLoading: true,
    };

    // Добавляем сообщения пользователя и загрузки в конец массива
    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);
    setPrompt("");

    if (user) {
      try {
        let dialogId = selectedChatId || (chatId ? parseInt(chatId) : null);

        if (!dialogId) {
          dialogId = await createNewDialog(Number(user.id), "gpt-4o-mini");
          setSelectedChatId(dialogId);
        }

        if (dialogId !== null) {
          const assitantResponse: Message = {
            text: null,
            isUser: false,
            isLoading: true,
            readPromptResponse: getStreamResponse(dialogId, prompt),
          };
          
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.pop(); // Удаляем последнее сообщение (сообщение загрузки)
            return [...updatedMessages, assitantResponse];
          });
        }
      } catch (error) {
        console.error("Error handling message submission:", error);
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.slice(0, -1); // Убираем сообщение загрузки
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
        const updatedMessages = prevMessages.slice(0, -1); // Убираем сообщение загрузки
        const errorMessage: Message = {
          text: "Error: user data not found.",
          isUser: false,
        };
        return [...updatedMessages, errorMessage];
      });
    }
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* <ChatList onSelectChat={setSelectedChatId} /> */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header chatId={chatId} />
        <MessageList 
          setLoading={setIsLoading} 
          messages={messages} 
          endOfMessagesRef={endOfMessagesRef} 
          />
        <MessageInput
          prompt={prompt}
          setPrompt={setPrompt}
          handleSubmit={handleSubmit}
          isLoading={isLoading} 
        />
      </Box>
    </Box>
  );
};

export default Chat;
