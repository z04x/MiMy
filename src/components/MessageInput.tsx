// src/components/MessageInput.tsx

import React, { FormEvent } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: FormEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ prompt, setPrompt, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Send your message"
        multiline
        rows={1}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: '16px',
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
            overflow: 'hidden',
            minHeight: '20px',
            transition: 'all 0.3s ease',
            '&:focus': {
              minHeight: '120px',
              transform: 'scaleY(1.1)',
              transformOrigin: 'top',
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
              <IconButton type="submit" aria-label="send">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};

export default MessageInput;
