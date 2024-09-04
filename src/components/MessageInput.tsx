import React, { forwardRef } from "react";
import { TextField } from "@mui/material";
import useResizeObserver from "../hooks/MessageInput/useResizeObserver";

interface MessageInputProps {
  isLoading: boolean;
  onHeightChange: (height: number) => void;
  value: string;
  onChange: (value: string) => void;
}

const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  function MessageInput({ isLoading, onHeightChange, value, onChange }, ref) {

    const formRef = useResizeObserver(() => {
      if (formRef.current) {
        const currentHeight = formRef.current.offsetHeight;
        onHeightChange(currentHeight);
      }
    });

    return (
      <form
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
