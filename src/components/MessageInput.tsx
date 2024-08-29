import React, { useState, useEffect } from "react";
import { TextField, Paper } from "@mui/material";
import { MainButton } from "@telegram-apps/sdk";
import { forwardRef } from "react";
interface MessageInputProps {
  ref: React.RefObject<HTMLDivElement>;
  mainButton: MainButton;
  sendPromptToServer: (prompt: string) => void; // Ensure this matches your actual type
  isLoading: boolean;
}

const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>(
  function MessageInput({ mainButton, sendPromptToServer, isLoading }, ref) {
    const [prompt, setPrompt] = useState("");

    const handleSubmit = () => {
      const savedPrompt = prompt;
      setPrompt("");
      // sendPromptToServer(savedPrompt); // Call the handleSubmit function
      console.log("Saved prompt:", savedPrompt);
    };

    useEffect(() => {
      if (prompt) {
        mainButton.setParams({
          isEnabled: true,
        });
      } else {
        mainButton.setParams({
          isEnabled: false,
        });
      }
    }, [prompt, mainButton]);

    return (
      <Paper
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "background.default",
          zIndex: 1000,
          padding: "auto 15px",
          position: "fixed",
          bottom: "0",
          left: "0",
          width: "100%",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, display: "flex", alignItems: "center" }}
        >
          <TextField
            multiline
            inputRef={ref}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type a message..."
            InputProps={{
              style: {
                padding: "auto 15px",
                borderRadius: "26px",
                // height: 'auto', // 5 lines max height
                // maxHeight: 'auto' // 5 lines max height
              },
            }}
            sx={{ flexGrow: 1, marginRight: "10px" }}
          />
        </form>
      </Paper>
    );
  }
);

export default MessageInput;
