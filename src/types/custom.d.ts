import { ButtonPropsVariantOverrides } from '@mui/material/Button';

// Расширяем существующие варианты кнопок
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    custom: true;
    'custom-flipped': true;
  }
}