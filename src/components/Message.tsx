import React, { memo, useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Message } from "../interfaces/Message";

interface MessageProps {
  message: Message;
  index: number;
  setLoading: (isLoading: boolean) => void; // добавляем функцию для управления состоянием загрузки
}

const MessageComponent: React.FC<MessageProps> = memo(({ message, index, setLoading }) => {
  const [body, setBody] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy"); // состояние для текста кнопки

  useEffect(() => {
    if (message.text) {
      setBody(message.text);
      setLoading(false) // endLoading
    } else {
      if (message.readPromptResponse) {
        let result = "";
        setLoading(true);
        message.readPromptResponse.then(async (reader) => {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            result += value;
            setBody(result);
          }
          setLoading(false); // Завершаем загрузку после получения данных
        });
        message.isLoading = false;
      }
    }
  }, [message, setLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(body).then(() => {
      setCopyStatus("Copied!"); // Обновляем текст кнопки на "Copied"
      setTimeout(() => setCopyStatus("Copy"), 2000); // Возвращаем "Copy" через 2 секунды
    });
  };

  return (
    <Box
      key={index}
      sx={{
        mb: 3,
        display: "flex",
        width: "100%",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: message.isUser ? "end" : "start",
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
          
          width: message.isUser ? "70%" : "100%",
          alignItems: message.isUser ? "end" : "start",
          flexDirection: "column",
          wordBreak: "break-word",
          position: "relative",
        }}
      >
        {message.isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <>
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
            {/* Кнопка для копирования с текстом */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p:'5px 10px',
              borderRadius:'16px',
              bgcolor: message.isUser ? "background.default" : "background.paper"
              }}>
              <IconButton onClick={handleCopy} sx={{ color: '#fff', p:0}}>
                <ContentCopyIcon />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ color: "#fff", cursor: 'pointer'}}
                onClick={handleCopy}
              >
                {copyStatus}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
});

export default MessageComponent;
