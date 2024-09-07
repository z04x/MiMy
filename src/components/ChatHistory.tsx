import React, { useState, useEffect, useCallback } from "react";
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
import salesGenerator from "../assets/images/salesGenerator.png";
import { useNavigate } from "react-router-dom";
import { useUser } from '../contexts/UserContext'; 
import { initMainButton } from "@telegram-apps/sdk";
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment-timezone';
import { useBackButton } from "../hooks/Chat/useBackButton";
const [mainButton] = initMainButton(); 
mainButton.hide();

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Пустой чат";

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
  const [groupedChats, setGroupedChats] = useState<GroupedChats>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const {setIsVisible } = useBackButton();
  interface GroupedChats {
  [key: string]: Chat[];
}
  const groupChatsByDate = useCallback((chats: Chat[]): GroupedChats => {
    const now = moment();
    const groups: GroupedChats = {
      'Today': [],
      'Yesterday': [],
      'Last week': [],
      'Last month': [],
      'Earlier': []
    };

    chats.forEach(chat => {
      const chatDate = moment(chat.updated_at);
      
      if (chatDate.isSame(now, 'day')) {
        groups['Today'].push(chat);
      } else if (chatDate.isSame(now.clone().subtract(1, 'day'), 'day')) {
        groups['Yesterday'].push(chat);
      } else if (chatDate.isSame(now, 'week')) {
        groups['Last week'].push(chat);
      } else if (chatDate.isSame(now, 'month')) {
        groups['Last month'].push(chat);
      } else {
        groups['Earlier'].push(chat);
      }
    });

    // Сортируем чаты внутри каждой группы
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => 
        new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime()
      );
    });

    // Удаляем пустые группы
    return Object.fromEntries(
      Object.entries(groups).filter(([_, chats]) => chats.length > 0)
    );
  }, []);

  useEffect(() => {
    setIsVisible(true);
    return () => {
      setIsVisible(false);
    };
  }, [setIsVisible]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      try {
        const chats = await getChatHistory(user.user_id);
        const sortedChats = chats.sort((a, b) => 
          new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime()
        );
        setChatHistory(sortedChats);
        setGroupedChats(groupChatsByDate(sortedChats));
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при получении истории чатов:", error);
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user, groupChatsByDate]);


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
        setGroupedChats(groupChatsByDate(updatedChats));
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
      bgcolor: "#171919",
      width: 40,
      height: 40,
    };
    switch (model) {
      case "gpt-4o-mini":
        return <Avatar src={gptIcon} sx={avatarStyle} />;
      case "open-mistral-nemo":
        return <Avatar src={mistralIcon} sx={avatarStyle} />;
      case "sales-text-generator":
        return  <Avatar
      sx={{
        ...avatarStyle,
        padding: 0, // Убираем внутренний отступ
      }}
    >
      <Box
        component="img"
        src={salesGenerator}
        sx={{
          width: '130%', // Делаем изображение на 30% больше
          height: '130%',
          objectFit: 'contain', // Сохраняем пропорции 
        }}
      />
    </Avatar>
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
        setGroupedChats(groupChatsByDate(chatHistory.map(chat =>
          chat.dialog_id === updatedChat.dialog_id ? updatedChat : chat
        )));
        handleRenameClose();
      } catch (error) {
        console.error("Ошибка при переименовании чата:", error);
      }
    }
  };
  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column", alignItems: "center", width: "100%", pb:'74px'}}>
      <Typography variant="h4" component="div" sx={{ mb: 3,pb:'16px', color: '#fff' }}>
        История чатов
      </Typography>
      {loading ? (
        <Typography variant="body1">Загрузка...</Typography>
      ) : Object.keys(groupedChats).length > 0 ? (
        <Box sx={{ overflow:'auto', width:'100%'}}>
          {Object.entries(groupedChats).map(([group, chats]) => (
            <Box key={group} sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <Typography variant="h6" sx={{ color: '#B3B4B4', mt: 2, mb: 1, pl: 2, fontSize:'14px',fontWeight:'regular' }}>
                {group}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: 'column', width: "100%"}}>
                {chats.map((chat) => (
                  <Box
                    key={chat.dialog_id}
                    sx={{ display: "flex", alignItems: "center", mb: '12px', bgcolor: 'background.paper', width: "100%", p: '0px 12px', borderRadius: '16px', cursor: 'pointer'}}
                    onClick={() => handleChatClick(chat.dialog_id)}
                  >
                    {getModelAvatar(chat.model)}
                    <Box sx={{ flexGrow: 1, p: 0, m: 0, minHeight:'56px', height:'66px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
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
                        {formatDate(chat.updated_at)}
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
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body1">История чатов отсутствует</Typography>
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

        <BottomNavBar current="/chat-history" />
    </Box>
  );
};

export default ChatHistory;
