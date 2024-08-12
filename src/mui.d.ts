import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeColors {
    default?: string;
    paper?: string;
    customBgBtn?: string;
    gray?: string;
  }
  
  interface Palette {
    colors: TypeColors;
  }
  
  interface PaletteOptions {
    colors?: Partial<TypeColors>;
  }
}