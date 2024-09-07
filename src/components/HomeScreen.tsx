// import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "./BottomNavBar";
// import { createChat } from "../services/dialogService";
import { useUser } from "../contexts/UserContext";
import { initMainButton } from "@telegram-apps/sdk";
import { createChat } from "../services/dialogService";
import { useBackButton } from "../hooks/Chat/useBackButton";
import { useEffect } from "react";

const [mainButton] = initMainButton();

const HomeScreen: React.FC = () => {
  // const [setOpen] = useState(false);
  // const [model] = useState<string>("gpt-4o-mini");
  // const [setLoading] = useState(false);
  // const [ setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser(); // Получаем пользователя из контекста
  const { setIsVisible } = useBackButton();

  mainButton.hide(); //todo вывести кнопку в контекст, что бы скрывать там где она не нужна

  // const handleCreateChat = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     if (!user) throw new Error("User not found"); // Проверяем, что пользователь существует
  //     const newDialogId = await createChat(user.user_id, model); // Используем user.user_id
  //     navigate(`/chat/${newDialogId}`);
  //   } catch (err) {
  //     console.error("Error creating chat:", err);
  //     setError("Failed to create chat");
  //   } finally {
  //     setLoading(false);
  //     setOpen(false);
  //   }
  // };

  useEffect(() => {
    setIsVisible(false);
    return () => {
      setIsVisible(true);
    };
  });

  const handleButtonClick = async (chatType: string) => {
    if (chatType === "simple-chat") {
      navigate("/model-selection", { state: { simpleChat: true } }); // Передаем флаг simpleChat
    } else {
      // пока что готова одна модель
      const isPremium = user?.subscription.subscription_type === "premium";
      if (isPremium) {
        try {
          if (!user) throw new Error("Пользователь не найден");
          const newDialogId = await createChat(
            user.user_id,
            chatType
          );
          navigate(`/chat/${newDialogId}`);
        } catch (err) {
          console.error("Ошибка при создании чата:", err);
          // Здесь можно добавить обработку ошибки, например, показать уведомление пользователю
        }
      } else {
        navigate("/upgrade");
      }
    }
  };

  // const isPremium = user?.subscription.subscription_type === 'premium';

  return (
    <Box
      sx={{
        padding: "74px 0px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <Box sx={{ maxWidth: "328px" }}>
        <Typography
          sx={{
            fontSize: "28px",
            fontWeight: "600",
            lineHeight: "36px",
            textAlign: "center",
            color: "#fff",
            pb: "16px",
          }}
        >
          ForgeAI
        </Typography>
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: "400",
            lineHeight: "22px",
            textAlign: "center",
            color: "#FFFFFFA3",
            pb: "32px",
          }}
        >
          Ассистенты, которые превращают идеи в результаты.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Button variant="text" onClick={() => handleButtonClick("simple-chat")}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "89px",
              height: "100%",
            }}
          >
            <img
              src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/simple-chat-logo.png"
              alt="Robot"
            />
          </Box>
          <Box sx={{ maxWidth: "300px" }}>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: "500",
                lineHeight: "22px",
                textAlign: "left",
                color: "#fff",
              }}
            >
              AI-чат: Базовый
            </Typography>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: "400",
                lineHeight: "22px",
                textAlign: "left",
                color: "#FFFFFFA3",
              }}
            >
              Простой интерфейс, мощные возможности.
            </Typography>
          </Box>
        </Button>

        <Button
          variant="text"
          onClick={() => handleButtonClick("sales-generator")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "89px",
              height: "100%",
            }}
          >
            <img
              src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/sales-generator.png"
              alt="Robot"
            />
          </Box>
          <Box sx={{ maxWidth: "300px" }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "17px",
                fontWeight: "500",
                lineHeight: "22px",
                textAlign: "left",
                color: "#fff",
              }}
            >
              КонтентМашина
              <img
                src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/premium-icon.svg"
                alt="Premium"
              />
            </Typography>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: "400",
                lineHeight: "22px",
                textAlign: "left",
                color: "#FFFFFFA3",
              }}
            >
              Опишите продукт — мы сделаем его продающим!
            </Typography>
          </Box>
        </Button>

        <Button
          variant="text"
          onClick={() => handleButtonClick("text-analyzer")}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "89px",
              height: "100%",
            }}
          >
            <img
              src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/sentiment-analyzator.png"
              alt="Robot"
            />
          </Box>
          <Box sx={{ maxWidth: "300px" }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "17px",
                fontWeight: "500",
                lineHeight: "22px",
                textAlign: "left",
                color: "#fff",
              }}
            >
              Анализатор
              <img
                src="https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/premium-icon.svg"
                alt="Premium"
              />
            </Typography>
            <Typography
              sx={{
                fontSize: "17px",
                fontWeight: "400",
                lineHeight: "22px",
                textAlign: "left",
                color: "#FFFFFFA3",
              }}
            >
              Узнайте, что в тексте помогает продажам, а что нет!
            </Typography>
          </Box>
        </Button>
      </Box>
      <BottomNavBar current="/" />
    </Box>
  );
};

export default HomeScreen;
