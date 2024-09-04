import React, { forwardRef, useEffect } from "react";
import { MainButton } from "@telegram-apps/sdk";
import { TextField } from "@mui/material";
import useResizeObserver from "../hooks/MessageInput/useResizeObserver"; // Импортируем хук для отслеживания изменений размера

interface MessageInputProps {
  mainButton: MainButton;
  sendPromptToServer: (prompt: string) => void;
  isLoading: boolean;
  onHeightChange: (height: number) => void;
  value: string;
  onChange: (value: string) => void;
}

const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  function MessageInput({ mainButton, sendPromptToServer, isLoading, onHeightChange, value, onChange }, ref) {

    const formRef = useResizeObserver(() => {
      if (formRef.current) {
        const currentHeight = formRef.current.offsetHeight;
        onHeightChange(currentHeight);
      }
    });

    useEffect(() => {
      mainButton.setParams({ isEnabled: !!value });
    }, [value, mainButton]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (value.trim()) {
        sendPromptToServer(value);
        onChange(''); // Очищаем поле ввода после отправки
      }
    };

    return (
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        style={{ display: "flex", alignItems: "center" }}
      >
        <TextField
          multiline
          maxRows={5}
          inputRef={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          InputProps={{
            style: {
              padding: "auto 15px",
              borderRadius: "26px",
            },
          }}
          sx={{ flexGrow: 1, marginRight: "10px" }}
        />
      </form>
    );
  }
);

export default MessageInput;
