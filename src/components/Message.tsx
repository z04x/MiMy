import React, { FormEvent, memo, useEffect, useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { Box, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { Message } from "../interfaces/Message";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import exp from "constants";

interface MessageProps {
  message: Message;
  index: number;
}

const MessageComponent: React.FC<MessageProps> = memo(({ message, index }) => {
  const [body, setBody] = useState("");

  useEffect(() => {
    console.log("UseEffect", message);
    if (message.text) {
      setBody(message.text);
    } else {
      if (message.readPromptResponse) {
        let result = "";
        message.readPromptResponse.then(async (reader) => {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            result += value;
            setBody(result);
          }
        });
        message.isLoading = false;
      }
    }
  }, []);

  return (
    <Box
      key={index}
      sx={{
        mb: 3,
        display: "flex",
        width: "100%",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          maxWidth: "100%",
          p: 1,
          borderRadius: "16px",
          backgroundColor: message.isUser
            ? "background.paper"
            : "background.default",
          color: message.isUser ? "#fff" : "#fff",
          boxShadow: 0,
          minHeight: "20px",
          display: "flex",
          alignItems: message.isUser ? "end" : "start",
          flexDirection: "column",
          wordBreak: "break-word",
          position: "relative",
        }}
      >
        {message.isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <ReactMarkdown
            components={{
              pre: ({ node, ...props }) => (
                <pre
                  style={{
                    backgroundColor: "#00000",
                    padding: "10px",
                    borderRadius: "8px",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                  }}
                  {...props}
                />
              ),
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter language={match[1]} style={vscDarkPlus}>
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props}>{children}</code>
                );
              },
            }}
          >
            {body}
          </ReactMarkdown>
        )}
      </Box>
    </Box>
  );
});

export default MessageComponent;
