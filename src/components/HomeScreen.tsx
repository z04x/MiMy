// src/components/HomeScreen.tsx

import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "./BottomNavBar";
import { createChat } from "../services/dialogService";
import { initMainButton } from '@telegram-apps/sdk';
const HomeScreen: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [mainButton] = initMainButton();
  // Имитируем получение данных пользователя
  const user = { id: 1, username: "user", first_name: "John", last_name: "Doe", premium: false }; // Замените это реальными данными
  mainButton.hide(); // Убедитесь, что метод hide существует
  const handleCreateChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const newDialogId = await createChat(123, model);
      navigate(`/chat/${newDialogId}`);
    } catch (err) {
      console.error("Error creating chat:", err);
      setError("Failed to create chat");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleButtonClick = (chatType: string) => {
    if (chatType === 'simple-chat') {
      setOpen(true); // Открываем модальное окно для выбора модели
    } else {
      if (user.premium || chatType !== 'premium') {
        navigate(`/upgrade`); // Переход к чату, если есть премиум или это не премиум чат
      } else {
        navigate('/upgrade'); // Переход на страницу предложения о покупке премиума
      }
    }
  };

  return (
    <Box
      sx={{
        padding:'74px 0px',
        display: "flex",
        flexDirection: "column",
        height: '100vh',
        alignItems:'center',
      }}
    >
      <Box sx={{maxWidth:'328px'}}>
        <Typography sx={{fontSize:'28px', fontWeight:'600', lineHeight:'36px', textAlign:'center', color:'#fff', pb:'16px'}}>
          Select type of AI generation
        </Typography>
        <Typography sx={{fontSize:'17px', fontWeight:'400', lineHeight:'22px', textAlign:'center', color:'#FFFFFFA3', pb:'32px'}}>
          I completed the final polish on the design and exported all the necessary assets.
        </Typography>
      </Box>

      <Box sx={{display:'flex', flexDirection:'column'}}>
        <Button 
          variant="custom"
          onClick={() => handleButtonClick('simple-chat')} 
        >
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '89px', height: '100%'}}>
            <img src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/simple-chat-logo.png" alt="Robot" />
          </Box>
          <Box sx={{maxWidth: '300px'}}>
            <Typography sx={{fontSize: '17px', fontWeight: '500', lineHeight: '22px', textAlign: 'left', color: '#fff'}}>
              Simple chat
            </Typography>
            <Typography sx={{fontSize: '17px', fontWeight: '400', lineHeight: '22px', textAlign: 'left', color: '#FFFFFFA3'}}>
              I completed the final polish on the design and exported all.
            </Typography>
          </Box>
        </Button>

        <Button 
          variant="custom-flipped"
          onClick={() => handleButtonClick('sales-generator')}
        >
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '89px', height: '100%'}}>
            <img src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/sales-generator.png" alt="Robot" />
          </Box>
          <Box sx={{maxWidth: '300px'}}>
            <Typography sx={{display:'flex', justifyContent:'space-between',fontSize: '17px', fontWeight: '500', lineHeight: '22px', textAlign: 'left', color: '#fff'}}>
              Generation of sales text
              <img src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/premium-icon.svg" alt="Premium" />
            </Typography>
            <Typography sx={{fontSize: '17px', fontWeight: '400', lineHeight: '22px', textAlign: 'left', color: '#FFFFFFA3',}}>
              I completed the final polish on the design and exported all.
            </Typography>
          </Box>
        </Button>

        <Button 
          variant="custom"
          onClick={() => handleButtonClick('sentiment-analysis')}
        >
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '89px', height: '100%'}}>
            <img src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/sentiment-analyzator.png" alt="Robot" />
          </Box>
          <Box sx={{maxWidth: '300px'}}>
            <Typography sx={{display:'flex', justifyContent:'space-between', fontSize: '17px', fontWeight: '500', lineHeight: '22px', textAlign: 'left', color: '#fff'}}>
              Sentiment Analysis
              <img src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/premium-icon.svg" alt="Premium" />
            </Typography>
            <Typography sx={{fontSize: '17px', fontWeight: '400', lineHeight: '22px', textAlign: 'left', color: '#FFFFFFA3'}}>
              I completed the final polish on the design and exported all.
            </Typography>
          </Box>
        </Button>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            padding: 4,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 400,
            mx: "auto",
            mt: 8,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Выберите модель
          </Typography>
          <RadioGroup value={model} onChange={(e) => setModel(e.target.value)}>
            <FormControlLabel
              value="gpt-4o-mini"
              control={<Radio />}
              label="GPT-4O-Mini"
            />
            <FormControlLabel
              value="mistral"
              control={<Radio />}
              label="Mistral"
            />
          </RadioGroup>
          <Button
            onClick={handleCreateChat}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Создание..." : "Создать чат"}
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </Modal>

      <BottomNavBar current="/" />
    </Box>
  );
};

export default HomeScreen;
