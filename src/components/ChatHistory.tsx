import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Импортируйте useNavigate вместо useHistory
import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

interface Chat {
  dialog_id: number;
  title: string | null;
}

const ChatHistory: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Используем useNavigate для навигации

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get<Chat[]>(`${BASE_URL}/dialogs`);
        setChatHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const handleCreateChat = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/dialogs`, {
        user_id: 123, // Здесь можно использовать настоящий user_id позже
        model: 'gpt-4o-mini', // Укажите нужную модель
      });

      const newChat = response.data;
      setChatHistory((prevChats) => [...prevChats, { dialog_id: newChat.dialog_id, title: `Chat ${newChat.dialog_id}` }]);
      navigate(`/chat/${newChat.dialog_id}`); // Переход на страницу нового чата
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}>
      <Typography variant="h4" component="div" sx={{ mb: 4 }}>
        Chat History
      </Typography>
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : chatHistory.length > 0 ? (
        <Box>
          {chatHistory.map((chat) => (
            <Button
              key={chat.dialog_id}
              component={Link}
              to={`/chat/${chat.dialog_id}`}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
            >
              {chat.title || `Chat ${chat.dialog_id}`}
            </Button>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">No chat history available</Typography>
      )}
      <Button onClick={handleCreateChat} variant="outlined" color="primary" fullWidth sx={{ mt: 4 }}>
        Create New Chat
      </Button>
    </Box>
  );
};

export default ChatHistory;
