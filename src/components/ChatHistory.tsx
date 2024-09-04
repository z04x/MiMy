import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BottomNavBar from "./BottomNavBar";
import { getChatHistory, deleteChat, renameChat, getChatsByUserId } from "../services/dialogService";
import Chat from "../interfaces/Chat";
import gptIcon from "../assets/images/chatgpt-6.svg";
import mistralIcon from "../assets/images/mistral-ai-icon-seeklogo.svg";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext'; 
import { initMainButton } from "@telegram-apps/sdk";
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment-timezone';
const [mainButton] = initMainButton(); 
mainButton.hide();



const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Нет обновлений";

  // Создаем объект Moment из строки в формате UTC
  const utcDate = moment.utc(dateString);

  // Получаем часовой пояс пользователя
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("Local TimeZone:", timeZone);

  // Форматируем дату и время с учетом часового пояса
  const formattedDate = utcDate.tz(timeZone).format('MMM D, HH:mm');
  console.log("Formatted Date:", formattedDate);

  return formattedDate;
};

const ChatHistory: React.FC = () => {
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedChats = await getChatsByUserId(user.user_id);
        setChatHistory(updatedChats);
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

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, chat: Chat) => {
    event.stopPropagation(); // Предотвращаем переход в чат
    setSelectedChat(chat);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRenameClick = () => {
    setNewTitle(selectedChat?.title || `Chat ${selectedChat?.dialog_id}`);
    setOpenRenameDialog(true);
    handleMenuClose();
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
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column", alignItems: "center", width: "100%", pb:'62px', position:'relative'}}>
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
                onClick={(e) => handleMenuClick(e, chat)}
                sx={{ color: '#fff', mr: 1 }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">No chat history available</Typography>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: '#1E1E1E',
            width:'100%',
            maxWidth:'240px',
            borderRadius: '16px',
          }
        }}
      >
        <MenuItem onClick={handleRenameClick} sx={{ padding: '12px 16px' }}>
        <ListItemText 
            primary="Rename" 
            primaryTypographyProps={{ 
              sx: { color: '#FFFFFF', fontWeight: 500 } 
            }} 
          />
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: '#FFFFFF' }} />
          </ListItemIcon>
        </MenuItem>
        <div style={{ borderBottom: '1px solid #2C2C2C' }}></div>
        <MenuItem onClick={() => {
          if (selectedChat) {
            handleDeleteChat(selectedChat.dialog_id);
            handleMenuClose();
          }
        }} sx={{ padding: '12px 16px' }}>
          <ListItemText 
            primary="Delete" 
            primaryTypographyProps={{ 
              sx: { color: '#FF3B30', fontWeight: 500 } 
            }} 
          />
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: '#FF3B30' }} />
          </ListItemIcon>
          
        </MenuItem>
      </Menu>

      <Dialog 
        open={openRenameDialog} 
        onClose={handleRenameClose}
        PaperProps={{
          style: {
            backgroundColor: '#1E1E1E',
            borderRadius: '12px',
            padding: '16px',
            position:'absolute',
            top:'10%',
            left:'0',
            right:'0',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFFFFF', fontSize: '18px', fontWeight:'600', textAlign: 'center', padding: '0px 0', marginBottom: '16px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          Rename the chat
          <IconButton
          aria-label="close"
          onClick={handleRenameClose}
          sx={{
            color: '#FFFFFF'
          }}
        >
          <CloseIcon />
        </IconButton>
        </DialogTitle>
        <DialogContent sx={{ width: '100%', padding: '0' }}>
          <TextField
            type="text"
            fullWidth
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            variant="outlined"
            InputProps={{
              style: {
                color: '#FFFFFF',
                backgroundColor: '#2C2C2C',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '16px',
                maxHeight:'46px',
                overflow:'hidden'
              }
            }}
            placeholder="Новое название"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px 0 0 0' }}>
          <Button 
            variant="contained" 
            onClick={handleRenameSubmit}
            sx={{
              color: '#FFFFFF',
              backgroundColor: '#088C5D',
              textAlign: 'center',
              width: '100%',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '16px',
              padding: '10px 0',
              maxHeight:'46px'
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <BottomNavBar current="/history" />
    </Box>
  );
};

export default ChatHistory;
