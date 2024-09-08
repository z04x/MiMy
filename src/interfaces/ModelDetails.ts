export interface ModelDetails {
  id: number;
  label: string;
  logo_url: string;
  assistant_code: string;
  description: string;
  is_premium: boolean;
  preview_message: string;
  short_description: string;
}

export const simpleChatModel: ModelDetails = {
  id: 1,
  label: "AI-чат: Базовый",
  logo_url:
    "https://chat-agregator.s3.eu-central-1.amazonaws.com/svg-logos/simple-chat-logo.png",
  assistant_code: "simple-chat",
  description: "Simple Chat",
  is_premium: false,
  preview_message: "Simple Chat",
  short_description: "Простой интерфейс, мощные возможности.",
};
