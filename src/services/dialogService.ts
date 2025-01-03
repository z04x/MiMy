import api, { BASE_URL } from "./api";
import Chat from "../interfaces/Chat";

export const getMessagesFromDialog = async (dialogId: number) => {
  try {
    const response = await api.get(
      `/dialogs/${dialogId}/messages` // убрал слеш
    );
    console.log(response.data);
    return response.data.messages.map((message: any) => ({
      text: message.content,
      isUser: message.role === "user",
      isLoading: false,
    }));
  } catch (error) {
    console.error("Error fetching messages from dialog:", error);
    throw error;
  }
};

export const getStreamResponse = async (dialogId: number, prompt: string): Promise<ReadableStreamDefaultReader<string>> => {
  const response = await fetch(`${BASE_URL}/dialogs/${dialogId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader();
  return reader as ReadableStreamDefaultReader<string>;
};

export const getChatHistory = async (): Promise<Chat[]> => {
  try {
    const response = await api.get<Chat[]>(`/dialogs`);
    return response.data; // The data is already typed as Chat[]
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error; // Optionally re-throw the error
  }
};

export const deleteChat = async (dialog_id: number) => {
  try {
    const reponse = await api.delete(`/dialogs/${dialog_id}`); // убрал слеш
    return reponse.data;
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

export const createChat = async (userId: number, model: string) => {
  try {
    const response = await api.post(`/dialogs`, {
      user_id: userId,
      model: model,
    });
    return response.data.dialog_id;
  } catch (error) {
    console.error("Error creating new dialog:", error);
    throw error;
  }
};

export const getChatsByUserId = async (userId: number): Promise<Chat[]> => {
  try {
    const response = await api.get(`/dialogs`, {
      params: {
        user_id: userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dialogs by user ID:", error);
    throw error;
  }
};


const sanitizeInput = (input: string): string => {
  return input.replace(/<\/?[^>]+>/gi, ""); // Очистка от HTML тегов
};

const validateInput = (input: string): boolean => {
  return input.trim().length > 0; // Проверка на пустоту
};

export const renameChat = async (dialogId: number, newTitle: string) => {
  try {
    const sanitizedTitle = sanitizeInput(newTitle); // Очистка заголовка

    if (!validateInput(sanitizedTitle)) {
      throw new Error("The new title cannot be empty or contain only whitespace."); // Валидация заголовка
    }

    const response = await api.patch(`/dialogs/${dialogId}`, {
      title: sanitizedTitle,
    });

    return response.data;
  } catch (error) {
    console.error("Error renaming chat:", error);
    throw error;
  }
};