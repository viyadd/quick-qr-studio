// src/shared/ui/URLGenerator.tsx
"use client";

import React, { useState, useMemo } from "react";
import { TextField, Box, Typography, Paper } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react"; // Импортируем компонент для отрисовки

// interface URLGeneratorProps {
// }

const URLGenerator: React.FC /* <URLGeneratorProps> */ = () => {
  // Состояние для хранения введенного пользователем URL
  const [urlValue, setUrlValue] = useState<string>("https://example.com");

  // Обработчик изменения в поле ввода
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlValue(event.target.value);
  };

  // Мемоизируем компонент QR-кода
  const qrCodeElement = useMemo(
    () => (
      <QRCodeCanvas
        value={urlValue || "Невалидный ввод"}
        size={256}
        level="H"
        imageSettings={{
          src: null,
          height: 30,
          width: 30,
          excavate: true,
        }}
      />
    ),
    [urlValue]
  );

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
        Генератор QR-кода для URL
      </Typography>

      {/* Поле ввода */}
      <TextField
        fullWidth
        label="Введите URL для кодирования"
        variant="outlined"
        value={urlValue}
        onChange={handleUrlChange}
        margin="normal"
        helperText="Код будет обновляться в реальном времени."
      />

      {/* Область вывода QR-кода (Карточка Paper) */}
      <Paper
        elevation={6} // Увеличим тень для лучшего эффекта в темной теме
        sx={{
          mt: 4,
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {qrCodeElement}
      </Paper>

      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        Сканируйте этот код, чтобы проверить!
      </Typography>
    </Box>
  );
};

export default URLGenerator;
