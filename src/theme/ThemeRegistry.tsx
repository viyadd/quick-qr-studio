// src/theme/ThemeRegistry.tsx

"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import { getTheme } from "./getTheme";
import { PaletteMode } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

// Создаем контекст для доступа к настройкам темы (например, для переключения)
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

// Компонент-провайдер для обертывания всего приложения
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Устанавливаем темную тему по умолчанию
  const [mode, setMode] = React.useState<PaletteMode>("dark");

  // Логика для переключения темы (будет доступна через ColorModeContext)
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );

  // Получаем текущую тему
  const theme = React.useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      {/* Оборачиваем в провайдер кэша Emotion для SSR */}
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        {/* Оборачиваем в провайдер темы MUI */}
        <ThemeProvider theme={theme}>
          {/* CssBaseline сбрасывает стили и применяет фон темы */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </ColorModeContext.Provider>
  );
}
