// src/widgets/SideBar/SideBar.tsx

"use client";

import * as React from "react";
import { Paper, useTheme } from "@mui/material";
import { ThemeToggler, LanguageToggle } from "@/shared/ui";

const SIDEBAR_WIDTH = 64;

/**
 * Фиксированная вертикальная боковая панель (SideBar) для переключения темы и языка.
 * Располагается слева и не скроллится.
 */
export const SideBar: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper
      elevation={4}
      square={true}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: SIDEBAR_WIDTH,
        zIndex: theme.zIndex.appBar + 1,

        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 1,
        gap: 1,
        boxSizing: "border-box",
      }}
    >
      <ThemeToggler />

      <LanguageToggle />
    </Paper>
  );
};

export default SideBar;
