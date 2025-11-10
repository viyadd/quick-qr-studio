// src/theme/getTheme.ts

import { createTheme, PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light Palette
            primary: {
              main: "#20639B",
            },
            secondary: {
              main: "#3CA640",
            },
            background: {
              default: "#f4f6f8",
              paper: "#ffffff",
            },
          }
        : {
            // Dark Palette
            primary: {
              main: "#4dabf5", // Более светлый оттенок для темной темы
            },
            secondary: {
              main: "#76d379", // Более светлый оттенок для темной темы
            },
            background: {
              default: "#121212", // Темный фон
              paper: "#1e1e1e", // Более светлый темный фон для карточек
            },
          }),
    },
    typography: {},
    // Дополнительные настройки темы можно добавить здесь
  });
