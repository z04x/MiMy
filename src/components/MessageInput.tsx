import React, { useState, useRef, useEffect } from "react";
import { TextField, Paper } from "@mui/material";

interface MessageInputProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // Ensure this matches your actual type
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  prompt,
  setPrompt,
  handleSubmit,
  isLoading
}) => {
  const [textareaHeight, setTextareaHeight] = useState<number>(40);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Adjust the height of the input field based on the content
  useEffect(() => {
    if (textareaRef.current) {
      setTextareaHeight(textareaRef.current.scrollHeight);
    }
  }, [prompt]);

  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "background.default",
        zIndex: 1000,
        padding: 'auto 15px',
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ flex: 1, display: "flex", alignItems: "center" }}
      >
        <TextField
          multiline
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message..."
          InputProps={{
            inputRef: textareaRef,
            style: {
              padding: 'auto 15px',
              borderRadius: '26px',
              height: Math.min(textareaHeight, 23 * 5), // 5 lines max height
              maxHeight: Math.min(textareaHeight, 23 * 5) // 5 lines max height
            }
          }}
          sx={{ flexGrow: 1, marginRight: "10px" }}
        />
      </form>
    </Paper>
  );
};

export default MessageInput;
