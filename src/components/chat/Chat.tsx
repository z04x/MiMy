import { Box } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useChat } from "../../hooks/Chat/useChat";
import { useMainButton } from "../../hooks/Chat/useMainButton";
import { ModelDetails } from "../../interfaces/ModelDetails";
import { getModelById } from "../../services/dialogService";
import MessageInput from "../messages/MessageInput";
import MessageList from "../messages/MessageList";

const CHAT_STYLES = {
  container: { height: "100%", maxHeight: "100%", overflow: "hidden" },
  innerContainer: { display: "flex", flexDirection: "column", width: "100%" },
  messageListContainer: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
  },
  messageInputContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    pl: 1,
    pr: 1,
    width: "100%",
  },
};

const Chat: React.FC = () => {
  const { chatId = "" } = useParams<{ chatId: string }>();
  const [searchParams] = useSearchParams();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [formHeight, setFormHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const { user, loading } = useUser();
  const { messages, isLoading, handleSubmit, setLoading } = useChat(
    chatId,
    user!
  );
  const [modelDetails, setModelDetails] = useState<ModelDetails | null>(null);

  const { setClickHandler, setEnabled } = useMainButton();

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleMainButtonClick = useCallback(async () => {
    if (inputValue.trim()) {
      try {
        await handleSubmit(
          inputValue,
          searchParams.get("model") || "gpt-4o-mini"
        );
        setInputValue("");
      } catch (error) {
        console.error("Ошибка при отправке сообщения:", error);
      }
    }
  }, [inputValue, handleSubmit, searchParams]);

  useEffect(() => {
    setClickHandler(handleMainButtonClick);
  }, [setClickHandler, handleMainButtonClick]);

  useEffect(() => {
    if (user && chatId) {
      const fetchModelDetails = async () => {
        console.log("searchParams.get('model')", searchParams.get("model"));
        try {
          const details = await getModelById(
            searchParams.get("model") || "gpt-4o-mini"
          );
          setModelDetails(details);
        } catch (error) {
          console.error("Ошибка при получении деталей модели:", error);
        }
      };

      fetchModelDetails();
    }
  }, [user, chatId, searchParams]);

  useEffect(() => {
    setEnabled(!!inputValue.trim());
  }, [inputValue, setEnabled]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const memoizedMessageList = useMemo(
    () => (
      <MessageList
        messages={messages}
        endOfMessagesRef={endOfMessagesRef}
        setLoading={setLoading}
        modelDetails={modelDetails}
      />
    ),
    [messages, endOfMessagesRef, setLoading, modelDetails]
  );

  const memoizedMessageInput = useMemo(
    () => (
      <MessageInput
        ref={messageInputRef}
        isLoading={isLoading}
        onHeightChange={setFormHeight}
        value={inputValue}
        onChange={handleInputChange}
      />
    ),
    [isLoading, inputValue, handleInputChange]
  );

  return (
    <>
      {loading && <div>Загрузка...</div>}
      {!loading && user && (
        <Box sx={CHAT_STYLES.container}>
          <Box sx={CHAT_STYLES.innerContainer}>
            <Box
              sx={{
                ...CHAT_STYLES.messageListContainer,
                pb: `${formHeight}px`,
              }}
            >
              {memoizedMessageList}
            </Box>
            <Box sx={CHAT_STYLES.messageInputContainer}>
              {memoizedMessageInput}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chat;
