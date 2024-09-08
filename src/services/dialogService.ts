import api, { BASE_URL } from "./api";
import Chat from "../interfaces/Chat";
import axios from "axios";

export const getMessagesFromDialog = async (
  userId: number,
  dialogId: string
) => {
  try {
    const response = await api.get(
      `/users/${userId}/dialogs/${dialogId}/messages`
    );
    return {
      messages: response.data.messages.map((message: any) => ({
        text: message.content,
        isUser: message.role === "user",
        isLoading: false,
      })),
      model: response.data.dialog.model, // Теперь получаем model из dialog
    };
  } catch (error) {
    // console.error("Ошибка при получении сообщений из диалога:", error);
    throw error;
  }
};

export const getStreamResponse = async (
  userId: number,
  dialogId: string,
  prompt: string
): Promise<ReadableStreamDefaultReader<string>> => {
  const response = await fetch(
    `${BASE_URL}/users/${userId}/dialogs/${dialogId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  );

  const reader = response
    .body!.pipeThrough(new TextDecoderStream())
    .getReader();
  return reader as ReadableStreamDefaultReader<string>;
};

export const getChatHistory = async (userId: number): Promise<Chat[]> => {
  try {
    const response = await api.get<Chat[]>(`/users/${userId}/dialogs`);
    return response.data; // The data is already typed as Chat[]
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error; // Optionally re-throw the error
  }
};

export const deleteChat = async (
  userId: number,
  dialog_id: number
): Promise<boolean> => {
  try {
    const response = await api.delete(`/users/${userId}/dialogs/${dialog_id}`);
    console.log(
      "Полный ответ сервера при удалении:",
      JSON.stringify(response, null, 2)
    );
    if (response.status === 200 && response.data && response.data.success) {
      return true;
    } else {
      console.error("Сервер вернул неожиданный ответ при удалении:", response);
      return false;
    }
  } catch (error) {
    console.error("Ошибка при удалении чата:", error);
    return false;
  }
};

export const createChat = async (
  userId: number,
  model: string,
  dialogId: string
) => {
  try {
    const response = await api.post(`/users/${userId}/dialogs`, {
      model: model,
      dialog_id: dialogId,
    });
    return response.data.dialog_id;
  } catch (error) {
    console.error("Error creating new dialog:", error);
    throw error;
  }
};

export const getChatsByUserId = async (userId: number): Promise<Chat[]> => {
  try {
    const response = await api.get(`/users/${userId}/dialogs`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении диалогов пользователя:", error);
    throw error;
  }
};

export const renameChat = async (
  userId: number,
  dialogId: number,
  newTitle: string
): Promise<Chat> => {
  try {
    const response = await api.patch<Chat>(
      `/users/${userId}/dialogs/${dialogId}`,
      {
        title: newTitle,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ошибка при переименовании чата:", error.message);
      console.error("Статус ошибки:", error.response?.status);
      console.error("Данные ошибки:", error.response?.data);
      console.error("Конфигурация запроса:", error.config);
    } else {
      console.error("Неизвестная ошибка при переименовании чата:", error);
    }
    throw error;
  }
};

export const getChatInfo = async (
  userId: number,
  dialogId: number
): Promise<Chat> => {
  const response = await fetch(`/chats/${userId}/${dialogId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat info");
  }

  return response.json();
};

export interface Model {
  assistant_code: string;
  label: string;
  logo_url: string;
  is_premium: boolean;
  short_description: string;
}

interface ModelDetails extends Model {
  id: number;
  description: string;
  preview_message: string;
}

export const getAllModels = async (): Promise<Model[]> => {
  try {
    const response = await api.get<Model[]>("/models");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка моделей:", error);
    throw error;
  }
};

export const getModelById = async (model: string): Promise<ModelDetails> => {
  try {
    const response = await api.get<ModelDetails>(`/models/${model}`);
    console.log("Ответ API для модели:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении деталей модели:", error);
    throw error;
  }
};
