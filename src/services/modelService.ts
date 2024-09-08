import api from "./api";
import { ModelDetails, simpleChatModel } from "../interfaces/ModelDetails";

const getModels = async (isPremium: boolean): Promise<ModelDetails[]> => {
  try {
    const response = await api.get<ModelDetails[]>("/models", {
      params: {
        premium: isPremium,
      },
    });
    return [simpleChatModel, ...response.data];
  } catch (error) {
    console.error("Error fetching all models:", error);
    throw error;
  }
};

const getModelByAssistantCode = async (
  assistantCode: string
): Promise<ModelDetails | null> => {
  try {
    const response = await api.get<ModelDetails[]>("/models");
    const model = response.data.find(
      (model) => model.assistant_code === assistantCode
    );
    return model || null;
  } catch (error) {
    console.error("Error fetching model by assistant code:", error);
    throw error;
  }
};

export { getModels, getModelByAssistantCode };
