// src/shared/ui/ThemeToggler.tsx

"use client";

import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "@/theme/ThemeRegistry";

/**
 * Компонент-переключатель темы (светлая/темная).
 * Использует ColorModeContext из ThemeRegistry для доступа к функции toggleColorMode.
 * Использует useTheme для получения текущего режима (light/dark) и отображения нужной иконки.
 */
export const ThemeToggler = () => {
  const colorMode = React.useContext(ColorModeContext);

  const theme = useTheme();

  return (
    <Tooltip title="Переключить тему" placement="right">
      <IconButton
        onClick={colorMode.toggleColorMode}
        color="inherit"
        size="small"
        aria-label="Переключить тему"
      >
        {theme.palette.mode === "dark" ? (
          <Brightness7Icon />
        ) : (
          <Brightness4Icon />
        )}
      </IconButton>
    </Tooltip>
  );
};
