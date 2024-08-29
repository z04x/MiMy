// theme.d.ts

import '@mui/material/styles';

// Расширение интерфейса PaletteOptions для добавления кастомных цветов
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      inputBg: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      inputBg?: string;
      sendBg?: string;
    };
  }
}
