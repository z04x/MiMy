import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, CircularProgress, IconButton, Typography, TypographyProps, BoxProps } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Message } from "../../interfaces/Message";
import remarkGfm from 'remark-gfm';

// Определим тип для props компонента li
type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
  ordered?: boolean;
  index?: number;
  checked?: boolean;
  node?: any; // Используем any для node, так как его структура может быть сложной
};

// Обертка для Typography
const MarkdownTypography: React.FC<TypographyProps & { component?: React.ElementType }> = ({ component, ...props }) => (
  <Typography component={component as any} {...props} />
);

// Обертка для Box
const MarkdownBox: React.FC<BoxProps & { component?: React.ElementType }> = ({ component, ...props }) => (
  <Box component={component as any} {...props} />
);

interface MessageProps {
  message: Message;
  index: number;
  setLoading: (isLoading: boolean) => void;
  onPaymentRequired: () => void;
}

const MessageComponent: React.FC<MessageProps> = memo(
  ({ message, index, setLoading, onPaymentRequired }) => {
    const [body, setBody] = useState("");
    const [copyStatus, setCopyStatus] = useState("");
    const [codeCopyStatus, setCodeCopyStatus] = useState("");

    useEffect(() => {
      if (message.text) {
        setBody(message.text);
        setLoading(false);
      } else if (message.readPromptResponse) {
        let result = "";
        setLoading(true);
        message.readPromptResponse.then(async (response) => {
          if ('error' in response) {
            // Обработка ошибки
            setBody(response.error);
            setLoading(false);
            if (response.error.includes("Для продолжения использования сервиса требуется оплата")) {
              onPaymentRequired();  // Вызываем функцию при ошибке 402
            }
          } else {
            // Обработка успешного ответа
            const reader = response;
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              result += value;
              setBody(result);
            }
          }
          setLoading(false);
        });
        message.isLoading = false;
      }
    }, [message, setLoading, onPaymentRequired]);

    const copyToClipboard = useCallback(
      async (
        text: string,
        statusUpdater: React.Dispatch<React.SetStateAction<string>>
      ) => {
        try {
          await navigator.clipboard.writeText(text);
          statusUpdater("Copied!");
          setTimeout(() => {
            statusUpdater("");
          }, 1000);
        } catch (err) {
          console.warn("Failed to copy text:", err);
          fallbackCopyTextToClipboard(text, statusUpdater);
        }
      },
      []
    );
    const fallbackCopyTextToClipboard = (
      text: string,
      statusUpdater: React.Dispatch<React.SetStateAction<string>>
    ) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        statusUpdater("Copied!");
        setTimeout(() => {
          statusUpdater("");
        }, 1000);
      } catch (err) {
        console.warn("Failed to copy text using fallback method:", err);
      }
      document.body.removeChild(textArea);
    };

    const handleCopy = useCallback(
      () => copyToClipboard(body, setCopyStatus),
      [body, copyToClipboard]
    );

    const handleCodeCopy = useCallback(
      (codeString: string) => copyToClipboard(codeString, setCodeCopyStatus),
      [copyToClipboard]
    );

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
            borderRadius: message.isUser
              ? "16px 16px 0 16px"
              : "16px 16px 16px 0",
            backgroundColor: message.isUser
              ? "colors.default"
              : "background.default",
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
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeRaw, // Для поддержки рендеринга HTML
                  rehypeHighlight, // Подсветка синтаксиса
                  rehypeSlug, // Для добавления id в заголовки
                  rehypeAutolinkHeadings // Для создания ссылок на заголовки
                ]}
                components={{
                  pre: ({ node, ...props }) => (
                    <pre
                      style={{
                        width: "100%",
                        backgroundColor: "#454948",
                        padding: 0,
                        margin: 0,
                        marginBottom: 16,
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
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          backgroundColor: "#454948",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "#fff",
                            padding: "7px 10px 0px 10px",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "10px", fontWeight: "bold" }}
                          >
                            {match ? match[1].toUpperCase() : "CODE"}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton
                              onClick={() => handleCodeCopy(codeString)}
                              sx={{ color: "#fff", p: 0 }}
                            >
                              <ContentCopyIcon
                                sx={{ width: "16px", height: "auto" }}
                              />
                            </IconButton>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "10px",
                                ml: 1,
                              }}
                              onClick={() => handleCodeCopy(codeString)}
                            >
                              {codeCopyStatus}
                            </Typography>
                          </Box>
                        </Box>
                        <SyntaxHighlighter
                          language={match ? match[1] : undefined}
                          style={vscDarkPlus}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </Box>
                    ) : (
                      <code {...props}>
                        <em style={{borderRadius: "none"}}>{children}</em>
                      </code>
                    );
                  },
                  p: ({ node, ...props }) => (
                    <MarkdownTypography
                      component="p"
                      variant="body1"
                      sx={{ mb: 2, lineHeight: 1.6 }}
                      {...props as any}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <MarkdownTypography
                      component="h3"
                      variant="body1"
                      sx={{ mb: 1, mt: 2 }}
                      {...props as any}
                    />
                  ),
                  ul: ({ children, depth, ...props }: React.HTMLAttributes<HTMLUListElement> & { depth?: number }) => (
                    <ul
                      style={{
                        paddingLeft: depth && depth > 0 ? "20px" : "0",
                        listStyleType: "none",
                        margin: "8px 0",
                      }}
                      {...props}
                    >
                      {children}
                    </ul>
                  ),
                  ol: ({ children, depth, ...props }: React.HTMLAttributes<HTMLOListElement> & { depth?: number }) => (
                    <ol
                      style={{
                        paddingLeft: depth && depth > 0 ? "20px" : "0",
                        listStyleType: "none",
                        margin: "8px 0",
                        counterReset: "item",
                      }}
                      {...props}
                    >
                      {children}
                    </ol>
                  ),
                  li: ({ children, ordered, index, checked, node, ...props }: ListItemProps) => {
                    const isOrdered = node?.parentNode?.tagName === 'OL';
                    const isTaskItem = typeof checked === 'boolean';
                    let marker;
                    
                    if (isTaskItem) {
                      marker = checked ? '☑' : '☐';
                    } else if (isOrdered) {
                      const start = (node?.parentNode?.getAttribute('start') as number | null) || 1;
                      marker = `${start + (index || 0)}.`;
                    } else {
                      marker = '•';
                    }

                    return (
                      <li
                        style={{
                          marginBottom: "4px",
                          position: "relative",
                          paddingLeft: "24px",
                        }}
                        {...props}
                      >
                        <span 
                          style={{
                            position: "absolute",
                            left: "0",
                            top: "2px",
                            color: "#e0e0e0",
                            fontSize: isOrdered ? "inherit" : "0.8em",
                            lineHeight: "1.5",
                            minWidth: "20px",
                            textAlign: "right",
                            paddingRight: "4px",
                          }}
                        >
                          {marker}
                        </span>                      
                        {React.Children.map(children, child => {
                          if (React.isValidElement(child) && child.type === 'p') {
                            return React.Children.toArray(child.props.children).map((innerChild, index) => {
                              if (typeof innerChild === 'string') {
                                const parts = innerChild.split(/(\d+\.\d+\.)/g);
                                return parts.map((part, i) => {
                                  if (part.match(/^\d+\.\d+\.$/)) {
                                    return (
                                      <React.Fragment key={i}>
                                        <br />
                                        <span style={{ marginLeft: "20px" }}>{part} </span>
                                      </React.Fragment>
                                    );
                                  }
                                  return part;
                                });
                              }
                              return innerChild;
                            });
                          }
                          return child;
                        })}
                      </li>
                    );
                  },
                  blockquote: ({ node, ...props }) => (
                    <MarkdownBox
                      component="blockquote"
                      sx={{
                        borderLeft: "4px solid #ddd",
                        paddingLeft: "16px",
                        color: "#666",
                        fontStyle: "italic",
                        my: 2,
                      }}
                      {...props as any}
                    />
                  ),
                }}
              >
                {body}
              </ReactMarkdown>
              <Box
                sx={{
                  mt: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: "8px",
                  borderRadius: "8px",
                  bgcolor: message.isUser ? "#FFFFFF17" : "#FFFFFF17",
                }}
              >
                <IconButton
                  onClick={handleCopy}
                  sx={{ color: message.isUser ? "#fff" : "#fff", p: 0 }}
                >
                  <ContentCopyIcon sx={{ width: "16px", height: "auto" }} />
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: message.isUser ? "#fff" : "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
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
  }
);

export default MessageComponent;
