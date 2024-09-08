// import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomNavBar from "./BottomNavBar";
// import { createChat } from "../services/dialogService";
import { useUser } from "../contexts/UserContext";
import { initMainButton } from "@telegram-apps/sdk";
import { useBackButton } from "../hooks/Chat/useBackButton";
import { ModelDetails } from "../interfaces/ModelDetails";
import { getModels } from "../services/modelService";
import { useEffect } from "react";
import ModelComponent from "./models/Model";
import HomeScreenHeader from "./HomeScreenHeader";
import { v4 as uuidv4 } from "uuid";

const [mainButton] = initMainButton();

const HomeScreen: React.FC = () => {
  // const [setOpen] = useState(false);
  // const [model] = useState<string>("gpt-4o-mini");
  // const [setLoading] = useState(false);
  // const [ setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser(); // Получаем пользователя из контекста
  const { setIsVisible } = useBackButton();
  const [modelDetails, setModelDetails] = useState<ModelDetails[]>([]);

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

  useEffect(() => {
    getModels(true).then((models) => {
      setModelDetails(models);
    });
  }, []);

  const handleButtonClick = async (chatType: string) => {
    if (chatType === "simple-chat") {
      navigate("/model-selection", { state: { simpleChat: true } }); // Передаем флаг simpleChat
    } else {
      // пока что готова одна модель
      const isPremium = user?.subscription.subscription_type === "premium";
      if (isPremium) {
        try {
          if (!user) throw new Error("Пользователь не найден");
          const newDialogId = uuidv4();
          navigate(`/chat/${newDialogId}?model=${chatType}`);
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
      <HomeScreenHeader />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {modelDetails.map((model) => (
          <ModelComponent
            handleButtonClick={handleButtonClick}
            modelDetails={model}
          />
        ))}
      </Box>
      <BottomNavBar current="/" />
    </Box>
  );
};

export default HomeScreen;
