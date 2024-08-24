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

const HomeScreen: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState<string>("gpt-4o-mini");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Button onClick={() => setOpen(true)} variant="contained" sx={{ mb: 2 }}>
        Чистый чат
      </Button>
      <Button variant="contained" disabled sx={{ mb: 2 }}>
        Чат для создания продажных текстов
      </Button>
      <Button variant="contained" disabled>
        Чат для анализа сентимента
      </Button>

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
      <>
        {/* Содержимое HomeScreen */}
        <BottomNavBar current="/" />
      </>
    </Box>
  );
};

export default HomeScreen;
