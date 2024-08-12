import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Message } from '../interfaces/Message';

interface MessageListProps {
  messages: Message[];
  endOfMessagesRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, endOfMessagesRef }) => {
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={{
        mb: 4,
        height: '70vh',
        overflowY: 'auto',
        borderRadius: '10px',
        p: 0,
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {messages?.length > 0 ? (
        messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              mb: 3,
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                maxWidth: '100%',
                p: 1,
                borderRadius: '16px',
                backgroundColor: message.isUser ? 'background.paper' : 'background.default',
                color: message.isUser ? '#fff' : '#fff',
                boxShadow: 0,
                minHeight: '40px',
                display: 'flex',
                alignItems: message.isUser ? 'end' : 'start',
                flexDirection: 'column',
                wordBreak: 'break-word',
                position: 'relative',
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
                          backgroundColor: '#f4f4f4',
                          padding: '10px',
                          borderRadius: '8px',
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                          width: '100%',
                          margin: 0,
                        }}
                        {...props}
                      />
                    ),
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <SyntaxHighlighter
                          language={match[1]}
                          style={solarizedlight}
                          customStyle={{
                            backgroundColor: '#f4f4f4',
                            padding: '10px',
                            borderRadius: '8px',
                            overflowX: 'auto',
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          style={{
                            backgroundColor: '#f4f4f4',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                          }}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body1">No messages</Typography>
      )}
      <div ref={endOfMessagesRef} />
    </Box>
  );
};

export default MessageList;
