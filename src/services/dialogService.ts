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

export const getStreamResponse = async (dialogId: number, prompt: string) => {
  const response = await fetch(`${BASE_URL}/dialogs/${dialogId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });
  return response.body!.pipeThrough(new TextDecoderStream()).getReader();
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
