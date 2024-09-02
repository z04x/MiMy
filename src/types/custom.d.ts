import { ButtonPropsVariantOverrides } from "@mui/material/Button";

// Расширяем существующие варианты кнопок
declare module "@mui/material/Button" {
  interface MyButtonPropsVariantOverrides extends ButtonPropsVariantOverrides {
    custom: true;
    "custom-flipped": true;
  }
}
