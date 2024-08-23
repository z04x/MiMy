// src/components/CreateChat.tsx

import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:3333'; // Убедитесь, что адрес правильный

const CreateChat: React.FC = () => {
  const [userId, setUserId] = useState<number>(0); // Подставьте реальное значение userId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateChat = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/dialogs`, { // убрал слеш
        user_id: userId,
        model: 'gpt-4o-mini', // Или другой подходящий модель
      });

      const dialogId = response.data.dialog_id;
      navigate(`/chat/${dialogId}`);
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: '600px', mx: 'auto' }}>
      <Typography variant="h4" component="div" sx={{ mb: 4 }}>
        Create New Chat
      </Typography>
      <TextField
        label="User ID"
        type="number"
        value={userId}
        onChange={(e) => setUserId(Number(e.target.value))}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button
        onClick={handleCreateChat}
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Chat'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default CreateChat;
