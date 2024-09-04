import { useEffect, useRef, useCallback } from 'react';
import { initMainButton } from "@telegram-apps/sdk";

const [mainButton] = initMainButton();

export const useMainButton = () => {
  const handleClickRef = useRef<(() => void) | null>(null);
  
  const setClickHandler = useCallback((handler: () => void) => {
    handleClickRef.current = handler;
  }, []);

  useEffect(() => {
    mainButton.setParams({
      text: "Send  ➤",
      isVisible: true,
    });
    mainButton.setBgColor('#088C5D');

    const clickHandler = () => {
      if (handleClickRef.current) {
        handleClickRef.current();
      }
    };

    mainButton.on("click", clickHandler);
    console.log('mainButton', mainButton);
    return () => {
      mainButton.off("click", clickHandler);
      mainButton.hide();
    };
  }, []);
  
  const setEnabled = useCallback((isEnabled: boolean) => {
    mainButton.setParams({ isEnabled });
  }, []);

  return { setClickHandler, setEnabled };
};