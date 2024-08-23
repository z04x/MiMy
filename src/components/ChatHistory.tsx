// src/components/ChatHistory.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import BottomNavBar from './BottomNavBar';
const BASE_URL = 'http://localhost:3333';

interface Chat {
  dialog_id: number;
  title: string | null;
  model: string; // Добавлено поле для модели
}

const ChatHistory: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get<Chat[]>(`${BASE_URL}/dialogs`); // убрал слеш
        setChatHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const handleDeleteChat = async (dialog_id: number) => {
    try {
      await axios.delete(`${BASE_URL}/dialogs/${dialog_id}`); // убрал слеш
      setChatHistory((prevChats) => prevChats.filter(chat => chat.dialog_id !== dialog_id));
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const getModelAvatar = (model: string) => {
    switch (model) {
      case 'gpt-4o-mini':
        return <Avatar sx={{ bgcolor: 'blue', mr: 2 }}>G</Avatar>;
      case 'mistral':
        return <Avatar sx={{ bgcolor: 'green', mr: 2 }}>M</Avatar>;
      default:
        return <Avatar sx={{ bgcolor: 'grey', mr: 2 }}>?</Avatar>;
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}>
      <Typography variant="h4" component="div" sx={{ mb: 4 }}>
        История чатов
      </Typography>
      {loading ? (
        <Typography variant="body1">Загрузка...</Typography>
      ) : chatHistory.length > 0 ? (
        <Box>
          {chatHistory.map((chat) => (
            <Box key={chat.dialog_id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {getModelAvatar(chat.model)}
              <Button
                component={Link}
                to={`/chat/${chat.dialog_id}`}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ flexGrow: 1, mr: 2 }}
              >
                {chat.title || `Chat ${chat.dialog_id}`}
              </Button>
              <IconButton onClick={() => handleDeleteChat(chat.dialog_id)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">Нет доступной истории чатов</Typography>
      )}
      <>
    {/* Содержимое ChatHistory */}
    <BottomNavBar current="/history" />
    </>
    </Box>
  );
};

export default ChatHistory;
