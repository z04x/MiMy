import { Box, TextField } from "@mui/material";
import { forwardRef } from "react";
import useResizeObserver from "../../hooks/MessageInput/useResizeObserver";
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
      <Box
        ref={formRef}
        sx={{ display: "flex", alignItems: "center", height: '100%', width: '100%'}}
      >
        <TextField
          multiline
          fullWidth
          autoFocus
          minRows={1}
          maxRows={5}
          inputRef={ref}
          value={value}
          variant="outlined"
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          InputProps={{
            style: {
              border: '1px solid #383939',
              flexGrow: 1, 
              marginRight: '10px',              
              padding: 'auto 15px',
              marginBottom:'6px',
              borderRadius: '16px',
            },
          }}
        />
      </Box>
    );
  }
);

export default MessageInput;
