

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { createChat, getAllModels, Model } from "../services/dialogService";
import { useUser } from "../contexts/UserContext";
import { useBackButton } from "../hooks/Chat/useBackButton";
import BottomNavBar from "./BottomNavBar";

const ModelSelection: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const {setIsVisible } = useBackButton();
  const navigate = useNavigate();
  const { user } = useUser();
  const location = useLocation();
  const isSimpleChat = location.state?.simpleChat;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const allModels = await getAllModels();
        console.log("Все доступные модели:", allModels);
        if (isSimpleChat) {
          // Фильтруем только ChatGPT и Mistral для простого чата
          setModels(allModels.filter(model => 
            ['gpt-4o-mini', 'open-mistral-nemo'].includes(model.assistant_code)
          ));
        } else {
          setModels(allModels);
        }
      } catch (err) {
        console.error("Ошибка при загрузке моделей:", err);
        setError("Не удалось загрузить список моделей");
      }
    };

    fetchModels();
  }, [isSimpleChat]);

  useEffect(() => {
    setIsVisible(true);
    return () => {
      setIsVisible(false);
    };
  }, [setIsVisible]);

  const handleCreateChat = async (selectedModel: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("Пользователь не найден");
      const newDialogId = await createChat(user.user_id, selectedModel);
      navigate(`/chat/${newDialogId}`);
    } catch (err) {
      console.error("Ошибка при создании чата:", err);
      setError("Не удалось создать чат");
    } finally {
      setLoading(false);
    }
  };

  if (models.length === 0 && !error) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        padding: '74px 0px',
        display: "flex",
        flexDirection: "column",
        height: '100vh',
        width:'100%',
        alignItems: 'center',
      }}
    >
      <Box sx={{maxWidth:'328px'}}>
        <Typography sx={{fontSize:'28px', fontWeight:'600', lineHeight:'36px', textAlign:'center', color:'#fff', pb:'16px'}}>
            Выбор ассистента
        </Typography>
        <Typography sx={{fontSize:'17px', fontWeight:'400', lineHeight:'22px', textAlign:'center', color:'#FFFFFFA3', pb:'32px'}}>
            Вы почти на месте: выберите помощника для решения ваших задач.
        </Typography>
      </Box>

      <Box sx={{display:'flex', flexDirection:'column', width:'100%', justifyContent:'center', alignItems:'center'}}>
        {models.map((model) => (
          <Button 
            key={model.assistant_code}
            variant="text"
            onClick={() => handleCreateChat(model.assistant_code)}
            disabled={loading || (model.is_premium && user?.subscription.subscription_type !== 'premium')}
            sx={{maxWidth:'400px', height:'78px', display:'flex', alignItems:'center', justifyContent:'start'}}
          >
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center',borderRadius:'99px', width: '56px', height: '56px',minWidth:'56px',minHeight:'56px', backgroundColor:'#1F2322', mr:'12px', ml:'16px'}}>
              <img src={model.logo_url} alt={model.label} />
            </Box>
            <Box sx={{maxWidth: '256px'}}>
              <Typography sx={{fontSize: '17px', fontWeight: '500', lineHeight: '22px', textAlign: 'left', color: '#fff'}}>
                {model.label}
                {model.is_premium && <img src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/premium-icon.svg" alt="Premium" style={{marginLeft: '8px'}} />}
              </Typography>
              <Typography sx={{fontSize: '17px', fontWeight: '400', lineHeight: '22px', textAlign: 'left', color: '#FFFFFFA3'}}>
                {model.short_description}
              </Typography>
            </Box>
          </Button>
          
        ))}
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <BottomNavBar current="/" />
    </Box>
  );
};

export default ModelSelection;

        // <Button 
        //   variant="text"
        //   onClick={() => handleButtonClick('simple-chat')} 
        // >
        //   <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '89px', height: '100%'}}>
        //     <img src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/simple-chat-logo.png" alt="Robot" />
        //   </Box>
        //   <Box sx={{maxWidth: '300px'}}>
        //     <Typography sx={{fontSize: '17px', fontWeight: '500', lineHeight: '22px', textAlign: 'left', color: '#fff'}}>
        //       Simple chat
        //     </Typography>
        //     <Typography sx={{fontSize: '17px', fontWeight: '400', lineHeight: '22px', textAlign: 'left', color: '#FFFFFFA3'}}>
        //       I completed the final polish on the design and exported all.
        //     </Typography>
        //   </Box>
        // </Button>