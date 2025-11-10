// src/shared/ui/URLGenerator.tsx
"use client";

import React, { useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import { useI18n } from "@/shared/i18n/I18nContext";
import { QrCodeDisplay } from "@/shared/ui";

// interface URLGeneratorProps {
// }

export const QrUrlGenerator: React.FC /* <URLGeneratorProps> */ = () => {
  const { t } = useI18n();
  const [urlValue, setUrlValue] = useState<string>("https://example.com");

  // Обработчик изменения в поле ввода
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(event.target.value);
  };

  const qrData = urlValue.trim();

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
        helperText={t("url_helper_text")}
      />

      {/* Область вывода QR-кода (Карточка Paper) */}
      <QrCodeDisplay value={qrData} placeholderText={t("url_placeholder")} />

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
