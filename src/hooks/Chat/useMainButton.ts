import { useEffect } from 'react';
import { initMainButton } from "@telegram-apps/sdk";

const [mainButton] = initMainButton();

export const useMainButton = (handleClick: () => void) => {
    
  useEffect(() => {
    mainButton.setParams({
      text: "Send ->",
      isVisible: true,
    });
    mainButton.setBgColor('#088C5D');
    mainButton.on("click", handleClick);

    return () => {
      mainButton.off("click", handleClick);
      mainButton.hide();
    };
  }, [handleClick]);
  
  return mainButton; // Возвращаем mainButton
};