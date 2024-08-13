// src/interfaces/Message.ts

export interface Message {
  text: string | null;
  isUser: boolean;
  isLoading?: boolean;
  readPromptResponse?: Promise<ReadableStreamDefaultReader<string>>;
}
