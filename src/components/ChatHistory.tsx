
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BottomNavBar from "./BottomNavBar";
import { getChatHistory, deleteChat, renameChat } from "../services/dialogService";
import Chat from "../interfaces/Chat";
import ModalWindow from "./ModalWindow";
import gptIcon from "../assets/images/chatgpt-6.svg";
import mistralIcon from "../assets/images/mistral-ai-icon-seeklogo.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext'; // Обновляем импорт
import { initMainButton } from "@telegram-apps/sdk";
const [mainButton] = initMainButton(); 
const sanitizeInput = (input: string): string => {
  return input.replace(/<\/?[^>]+>/gi, "");
};

const validateInput = (input: string): boolean => {
  return input.trim().length > 0;
};

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
  const { user } = useUser(); // Получаем пользователя из контекста

  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const navigate = useNavigate();

  mainButton.hide()
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return; // Если пользователь не загружен, не загружаем историю чатов
          
      try {
        const chats = await getChatHistory(user.user_id);
        setChatHistory(chats);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user]);

  const handleDeleteChat = async (dialog_id: number) => {
    try {
      await deleteChat(dialog_id);
      setChatHistory((prevChats) =>
        prevChats.filter((chat) => chat.dialog_id !== dialog_id)
      );
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleOpenRenameDialog = (chat: Chat) => {
    setSelectedChatId(chat.dialog_id);
    setNewTitle(chat.title || `Chat ${chat.dialog_id}`);
    setRenameDialogOpen(true);
  };

  const handleRenameChat = async () => {
    if (selectedChatId === null || !validateInput(newTitle)) {
      console.error("No chat selected or new title is empty.");
      return;
    }

    try {
      const sanitizedTitle = sanitizeInput(newTitle.trim());
      await renameChat(selectedChatId, sanitizedTitle);
      setChatHistory((prevChats) =>
        prevChats.map((chat) =>
          chat.dialog_id === selectedChatId ? { ...chat, title: sanitizedTitle } : chat
        )
      );
      handleCloseRenameDialog();
    } catch (error) {
      console.error("Error renaming chat:", error);
    }
  };

  const handleCloseRenameDialog = () => {
    setRenameDialogOpen(false);
    setNewTitle("");
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, chatId: number) => {
    setAnchorEl(event.currentTarget);
    setCurrentChatId(chatId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentChatId(null);
  };

  const handleDeleteFromMenu = () => {
    if (currentChatId !== null) {
      handleDeleteChat(currentChatId);
      handleMenuClose();
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
              sx={{ display: "flex", alignItems: "center", mb: '12px', bgcolor: 'background.paper', width: "100%", p: '32px 12px', borderRadius: '16px', cursor: 'pointer' }}
              onClick={() => handleChatClick(chat.dialog_id)}
            >
              {getModelAvatar(chat.model)}
              <Box sx={{ flexGrow: 1, p: 0, m: 0 }}>
                <Typography sx={{ color: '#fff', fontWeight: '400', lineHeight: '22px' }} variant="h6">{chat.title || `Chat ${chat.dialog_id}`}</Typography>
                <Typography variant="body2" color="#B3B4B4">
                  Last updated: {formatDate(chat.updated_at)}
                </Typography>
              </Box>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering chat navigation when opening the menu
                  handleMenuOpen(e, chat.dialog_id);
                }}
                color="secondary"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={(e) => { e.stopPropagation(); handleMenuClose(); handleOpenRenameDialog(chat); }}>
                  <EditIcon sx={{ mr: 1 }} /> Rename Chat
                </MenuItem>
                <MenuItem onClick={(e) => { e.stopPropagation(); handleDeleteFromMenu(); }}>
                  <DeleteIcon sx={{ mr: 1 }} /> Delete Chat
                </MenuItem>
              </Menu>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">No chat history available</Typography>
      )}

      <ModalWindow
        open={renameDialogOpen}
        onClose={handleCloseRenameDialog}
        title="Rename the chat"
        onSave={handleRenameChat}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          autoFocus
          InputProps={{}}
        />
      </ModalWindow>

      <BottomNavBar current="/history" />
    </Box>
  );
};

export default ChatHistory;
