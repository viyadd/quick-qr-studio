// src/shared/ui/URLGenerator.tsx
"use client";

import React, { useMemo, useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { useI18n } from "@/shared/i18n/I18nContext";
import { QrCodeDisplay } from "@/shared/ui";

// interface URLGeneratorProps {
// }

const isValidUrl = (url: string): boolean => {
  try {
    // Пробуем создать объект URL. Если это удается, URL считается валидным.
    // Это достаточно строго, но хорошо отсекает невалидные форматы.
    new URL(url);
    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return false;
  }
};

export const QrUrlGenerator: React.FC /* <URLGeneratorProps> */ = () => {
  const { t } = useI18n();
  const [urlValue, setUrlValue] = useState<string>("https://example.com");

  // Обработчик изменения в поле ввода
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(event.target.value);
  };

  const qrData = urlValue.trim();

  const validation = useMemo(() => {
    const trimmedValue = qrData;

    // 1. Проверка на пустоту
    if (!trimmedValue) {
      return {
        error: false, // Не ошибка, а предупреждение
        helperText: t("url_error_empty"),
        validData: "", // Не кодируем пустую строку
      };
    }

    if (!isValidUrl(trimmedValue)) {
      return {
        error: true, // Настоящая ошибка
        helperText: t("url_error_invalid"),
        validData: "", // Не кодируем невалидные данные
      };
    }

    // 3. Валидно
    return {
      error: false,
      helperText: t("url_helper_text"), // Используем стандартный текст
      validData: trimmedValue, // Кодируем валидные данные
    };
  }, [qrData, t]);

  return (
    <Box
      sx={{
        p: 3,
        "& *": {
          boxSizing: "border-box",
        },
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {t("generator_url_title")}
      </Typography>

      {/* Поле ввода */}
      <TextField
        fullWidth
        label={t("url_label")}
        variant="outlined"
        value={urlValue}
        onChange={handleUrlChange}
        margin="normal"
        error={validation.error}
        helperText={t("url_helper_text")}
      />

      {/* Область вывода QR-кода (Карточка Paper) */}
      <QrCodeDisplay
        value={validation.validData}
        placeholderText={t("url_placeholder")}
      />

      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        {t("url_scan_caption")}
      </Typography>
    </Box>
  );
};

export default QrUrlGenerator;
