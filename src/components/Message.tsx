import React, { memo, useEffect, useState, useCallback } from "react";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Message } from "../interfaces/Message";

interface MessageProps {
  message: Message;
  index: number;
  setLoading: (isLoading: boolean) => void;
}

const MessageComponent: React.FC<MessageProps> = memo(({ message, index, setLoading }) => {
  const [body, setBody] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [codeCopyStatus, setCodeCopyStatus] = useState("Copy");

  useEffect(() => {
    if (message.text) {
      setBody(message.text);
      setLoading(false);
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
          setLoading(false);
        });
        message.isLoading = false;
      }
    }
  }, [message, setLoading]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(body).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    });
  }, [body]);

  const handleCodeCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopyStatus("Copied!");
      setTimeout(() => setCodeCopyStatus("Copy"), 2000);
    });
  }, []);

  return (
    <Box
      key={index}
      sx={{
        mb: 1.5,
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
          p: message.isUser ? 1 : 3,
          borderRadius: message.isUser ? "16px 16px 0 16px" : "16px 16px 16px 0",
          backgroundColor: message.isUser ? "colors.paper" : "colors.default",
          color: message.isUser ? "#fff" : "#fff",
          boxShadow: 0,
          minHeight: "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: message.isUser ? "end" : "start",
          wordBreak: "break-word",
          position: "relative",
          width: message.isUser ? "70%" : "100%",
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
                      width: '100%',
                      backgroundColor: "#454948",
                      padding: 0,
                      margin: 0,
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px',
                      overflowX: "auto",
                      whiteSpace: "pre-wrap",
                    }}
                    {...props}
                  />
                ),
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  return match ? (
                    <Box sx={{ position: 'relative', width: '100%', backgroundColor: '#454948', }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          color: '#fff',
                          padding: '7px 10px 0px 10px',
                          
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '10px', fontWeight: 'bold' }}>
                          {match ? match[1].toUpperCase() : 'CODE'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton onClick={() => handleCodeCopy(codeString)} sx={{ color: "#fff", p: 0 }}>
                            <ContentCopyIcon sx={{ width: '16px', height: 'auto' }} />
                          </IconButton>
                          <Typography
                            variant="body2"
                            sx={{ color: "#fff", cursor: 'pointer', fontSize: '10px', ml: 1 }}
                            onClick={() => handleCodeCopy(codeString)}
                          >
                            {codeCopyStatus}
                          </Typography>
                        </Box>
                      </Box>
                      <SyntaxHighlighter language={match ? match[1] : undefined} style={vscDarkPlus}>
                        {codeString}
                      </SyntaxHighlighter>
                    </Box>
                  ) : (
                    <code
                      style={{
                      }}
                      {...props}
                    >
                      <em>
                      {children}
                      </em>
                      
                    </code>
                  );
                },
              }}
            >
              {body}
            </ReactMarkdown>
            <Box
              sx={{
                mt: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                p: '5px 10px',
                borderRadius: '99px',
                bgcolor: message.isUser ? "#1F232217" : "#FFFFFF17",
              }}
            >
              <IconButton onClick={handleCopy} sx={{ color: message.isUser ? "#fff" : "#fff", p: 0 }}>
                <ContentCopyIcon sx={{ width: '16px', height: 'auto' }} />
              </IconButton>
              <Typography
                variant="body2"
                sx={{ color: message.isUser ? "#fff" : "#fff", cursor: 'pointer', fontSize: '14px' }}
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
