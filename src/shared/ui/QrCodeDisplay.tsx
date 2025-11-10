// src/shared/ui/QrCodeDisplay.tsx
"use client";

import React, { useMemo } from "react";
import { Paper, Typography } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeDisplayProps {
  /** Данные, которые будут закодированы в QR-коде. */
  value: string;
  /** Текст, отображаемый, если QR-код не может быть сгенерирован (например, нет данных). */
  placeholderText?: string;
}

export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
  value,
  placeholderText = "Введите данные для кодирования",
}) => {
  // Определяем, есть ли валидные данные для отображения QR-кода
  const hasValidData = value.trim().length > 0 && value !== placeholderText;

  // Мемоизируем компонент QR-кода или заглушку
  const content = useMemo(() => {
    if (!hasValidData) {
      return (
        <Typography color="text.secondary" sx={{ p: 4 }}>
          {placeholderText}
        </Typography>
      );
    }

    // Если данные есть, возвращаем сам QR-код
    return (
      <QRCodeCanvas
        value={value}
        size={256}
        level="H"
        imageSettings={{
          src: null,
          height: 30,
          width: 30,
          excavate: true,
        }}
      />
    );
  }, [value, hasValidData, placeholderText]);

  return (
    // Область вывода QR-кода в карточке Paper
    <Paper
      elevation={6}
      sx={{
        mt: 4,
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // Устанавливаем минимальную высоту для симметрии, когда отображается заглушка
        minHeight: 256 + 24 * 2, // 256px размер кода + padding
      }}
    >
      {content}
    </Paper>
  );
};

export default QrCodeDisplay;
