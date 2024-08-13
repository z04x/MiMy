import React, { FormEvent, memo } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isLoading: boolean; // добавляем флаг загрузки
}

const MessageInput: React.FC<MessageInputProps> = memo(({ prompt, setPrompt, handleSubmit, isLoading }) => {
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || isLoading) return;

    await handleSubmit(e);
  }
  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="Send your message"
        multiline
        maxRows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: '16px',
          '& .MuiInputLabel-root': {
            color: '#9e9e9e', // Цвет метки по умолчанию
          },
          '& .Mui-focused .MuiInputLabel-root': {
            color: '#9e9e9e', // Цвет метки в фокусе
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#676767',
              borderRadius: '16px',
            },
            '&:hover fieldset': {
              borderColor: '#676767',
              borderRadius: '16px',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#676767',
              borderRadius: '16px',
            },
            '& input': {
              color: '#fff',
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#9e9e9e',
            },
          },
          '& textarea': {
            overflowY:'auto',
            color:'#fff',
            '&:focus': {
            },
          },
        }}
        InputLabelProps={{
          sx: {
            color: '#9e9e9e',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                type="submit" 
                aria-label="send"
                disabled={isLoading}
                sx={{
                  bgcolor:"#fff", 
                  p:"6px",
                  display:"flex",
                  alignItems:"center",
                  transition:"all 0.2s ease",
                  "&:hover": {
                    bgcolor:"#aaa", 
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
});

export default MessageInput;
