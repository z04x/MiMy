// import React, { useEffect, useState } from 'react';
// import { Box, List, ListItem, ListItemText, Button } from '@mui/material';
// import axios from 'axios';

// const BASE_URL = 'http://localhost:3333';

// interface Chat {
//   id: number;
//   title: string;
// }

// interface ChatListProps {
//   onSelectChat: (chatId: number) => void;
// }

// const ChatList: React.FC<ChatListProps> = ({ onSelectChat }) => {
//   const [chats, setChats] = useState<Chat[]>([]);

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const response = await axios.get<Chat[]>(`${BASE_URL}/dialogs`);
//         setChats(response.data);
//       } catch (error) {
//         console.error('Error fetching chats:', error);
//       }
//     };

//     fetchChats();
//   }, []);

//   const handleCreateChat = async () => {
//     try {
//       // Создаём новый чат
//       const response = await axios.post(`${BASE_URL}/dialogs`, {
//         user_id: 123, // Здесь можно использовать настоящий user_id позже
//         model: 'gpt-4o-mini', // Укажите нужную модель
//       });

//       const newChat = response.data;
//       // Добавляем новый чат в список чатов
//       setChats((prevChats) => [...prevChats, { id: newChat.dialog_id, title: `Chat ${newChat.dialog_id}` }]);
//       onSelectChat(newChat.dialog_id); // Сразу выбираем новый созданный чат
//     } catch (error) {
//       console.error('Error creating chat:', error);
//     }
//   };

//   return (
//     <Box sx={{ width: '200px', borderRight: '1px solid #ccc' }}>
//       <Button variant="contained" color="primary" onClick={handleCreateChat} sx={{ margin: '10px' }}>
//         Создать чат
//       </Button>
//       <List>
//         {chats.map((chat) => (
//           <ListItem button key={chat.id} onClick={() => onSelectChat(chat.id)}>
//             <ListItemText primary={`Chat ${chat.id}`} />
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );
// };

// export default ChatList;
export {};