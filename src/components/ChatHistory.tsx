import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BottomNavBar from "./BottomNavBar";
import { getChatHistory, deleteChat, renameChat, getChatsByUserId } from "../services/dialogService";
import Chat from "../interfaces/Chat";
import gptIcon from "../assets/images/chatgpt-6.svg";
import mistralIcon from "../assets/images/mistral-ai-icon-seeklogo.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext'; // Обновляем импорт
import { initMainButton } from "@telegram-apps/sdk";
const [mainButton] = initMainButton(); 
mainButton.hide();

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "No updates";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ChatHistory: React.FC = () => {
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      try {
        const chats = await getChatHistory(user.user_id);
        setChatHistory(chats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user]);

  const handleDeleteChat = async (dialog_id: number) => {
    try {
      if (!user) {
        console.error("Пользователь не авторизован");
        return;
      }
      const success = await deleteChat(user.user_id, dialog_id);
      if (success) {
        console.log("Сервер сообщил об успешном удалении чата");
        // Добавляем небольшую задержку
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedChats = await getChatsByUserId(user.user_id);
        console.log("Полученный список чатов:", updatedChats);
        
        const chatStillExists = updatedChats.some(chat => chat.dialog_id === dialog_id);
        if (chatStillExists) {
          console.error("Чат все еще присутствует в списке после удаления. ID чата:", dialog_id);
        } else {
          console.log("Чат успешно удален из списка");
          setChatHistory(updatedChats);
        }
        
        // Проверка состояния после обновления
        setTimeout(() => {
          console.log("Текущее состояние chatHistory:", chatHistory);
        }, 0);
      } else {
        console.error("Сервер сообщил о неудачном удалении чата");
      }
    } catch (error) {
      console.error("Ошибка при удалении чата:", error);
    }
  };

  const handleChatClick = (chatId: number) => {
    navigate(`/chat/${chatId}`);
  };

  const getModelAvatar = (model: string) => {
    const avatarStyle = {
      mr: 2,
      p: 1,
      bgcolor: "black",
      width: 40,
      height: 40,
    };
    switch (model) {
      case "gpt-4o-mini":
        return <Avatar src={gptIcon} sx={avatarStyle} />;
      case "mistral":
        return <Avatar src={mistralIcon} sx={avatarStyle} />;
      default:
        return <Avatar sx={{ bgcolor: "green", mr: 2 }}>?</Avatar>;
    }
  };

  const handleRenameClick = (chat: Chat) => {
    setSelectedChat(chat);
    setNewTitle(chat.title || `Chat ${chat.dialog_id}`);
    setOpenRenameDialog(true);
  };

  const handleRenameClose = () => {
    setOpenRenameDialog(false);
    setSelectedChat(null);
    setNewTitle("");
  };

  const handleRenameSubmit = async () => {
    if (selectedChat && user) {
      try {
        const updatedChat = await renameChat(user.user_id, selectedChat.dialog_id, newTitle);
        setChatHistory((prevChats) =>
          prevChats.map((chat) =>
            chat.dialog_id === updatedChat.dialog_id ? updatedChat : chat
          )
        );
        handleRenameClose();
      } catch (error) {
        console.error("Ошибка при переименовании чата:", error);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column", alignItems: "center", width: "100%", pb:'62px'}}>
      <Typography variant="h4" component="div" sx={{ mb: 4, color: '#fff' }}>
        Chat History
      </Typography>
      {loading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : chatHistory.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: 'column', width: "100%", overflowY:'auto',  height: "100%"}}>
          {chatHistory.map((chat) => (
            <Box
              key={chat.dialog_id}
              sx={{ display: "flex", alignItems: "center", mb: '12px', bgcolor: 'background.paper', width: "100%", p: '0px 12px', borderRadius: '16px', cursor: 'pointer' }}
              onClick={() => handleChatClick(chat.dialog_id)}
            >
              {getModelAvatar(chat.model)}
              <Box sx={{ flexGrow: 1, p: 0, m: 0, height:'56px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <Typography sx={{ color: '#fff', fontWeight: '400', lineHeight: '22px' }} variant="h6">
                  {(chat.title || `Chat ${chat.dialog_id}`)
                    .replace(/(Input prompt|Chat Title):/gi, '')
                    .trim()
                    .split(' ')
                    .slice(0, 5)
                    .join(' ')}
                  {(chat.title || `Chat ${chat.dialog_id}`).split(' ').length > 5 ? '...' : ''}
                </Typography>
                <Typography variant="body2" color="#B3B4B4">
                  Last updated: {formatDate(chat.updated_at)}
                </Typography>
              </Box>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleRenameClick(chat);
                }}
                sx={{ color: '#fff', mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.dialog_id);
                }}
                sx={{ color: '#fff' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">No chat history available</Typography>
      )}

      <Dialog open={openRenameDialog} onClose={handleRenameClose}>
        <DialogTitle>Переименовать чат</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Новое название"
            type="text"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameClose}>Отмена</Button>
          <Button onClick={handleRenameSubmit}>Переименовать</Button>
        </DialogActions>
      </Dialog>

      <BottomNavBar current="/history" />
    </Box>
  );
};

export default ChatHistory;
