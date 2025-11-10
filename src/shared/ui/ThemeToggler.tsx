// src/shared/ui/ThemeToggler.tsx

"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Иконка для темной темы
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Иконка для светлой темы
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "@/theme/ThemeRegistry";

/**
 * Компонент-переключатель темы (светлая/темная).
 * Использует ColorModeContext из ThemeRegistry для доступа к функции toggleColorMode.
 * Использует useTheme для получения текущего режима (light/dark) и отображения нужной иконки.
 */
export const ThemeToggler = () => {
  // Получаем функцию для переключения темы из контекста
  const colorMode = React.useContext(ColorModeContext);

  // Получаем текущую тему MUI
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-end", // Размещаем кнопку справа
        bgcolor: "background.default",
        color: "text.primary",
        p: 1, // Небольшой внутренний отступ
      }}
    >
      {/* Кнопка переключения */}
      <IconButton
        onClick={colorMode.toggleColorMode}
        color="inherit"
        aria-label="Переключить тему"
      >
        {/* Отображаем иконку в зависимости от текущего режима */}
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon /> // Если темная тема, показываем солнце (для переключения на светлую)
        ) : (
          <Brightness4Icon /> // Если светлая тема, показываем луну (для переключения на темную)
        )}
      </IconButton>
    </Box>
  );
};
