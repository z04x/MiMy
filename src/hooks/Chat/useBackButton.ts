import { useEffect, useCallback } from 'react';
import { initBackButton } from "@telegram-apps/sdk";

const [backButton] = initBackButton();

export const useBackButton = () => {
  useEffect(() => {
    backButton.on('click', () => {
      window.history.back();
    });
    console.log('backButton', backButton);

    return () => {
      backButton.off('click', () => {
        window.history.back();
      });
      backButton.hide();
    };
  }, []);

  const setIsVisible = useCallback((isVisible: boolean) => {
    if (isVisible) {
      backButton.show();
    } else {
      backButton.hide();
    }
  }, []);

  return { setIsVisible };
};