import { useState } from "react";

const usePromptInput = (initialValue: string = "") => {
  const [prompt, setPrompt] = useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const clearPrompt = () => {
    setPrompt("");
  };

  return {
    prompt,
    handleChange,
    clearPrompt,
  };
};

export default usePromptInput;
