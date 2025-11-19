// src/shared/ui/LanguageToggle.tsx
"use client";

import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useI18n } from "@/shared/i18n/I18nContext";
import { Language } from "@/shared/i18n/translations";

export const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useI18n();

  // Функция для переключения с текущего языка на другой
  const toggleLanguage = () => {
    const newLang: Language = lang === "ru" ? "en" : "ru";
    setLang(newLang);
  };

  const tooltipText =
    lang === "ru" ? "Switch to English" : "Переключить на Русский";
  const buttonText = lang === "ru" ? "EN" : "RU";

  return (
    <Tooltip title={tooltipText} placement="right">
      <IconButton
        onClick={toggleLanguage}
        color="inherit"
        size="small"
        sx={{
          p: 1.2,
          fontSize: "0.75rem",
          fontWeight: "bold",
        }}
      >
        {buttonText}
      </IconButton>
    </Tooltip>
  );
};

export default LanguageToggle;
