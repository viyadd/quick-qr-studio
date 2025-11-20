// src/shared/ui/URLGenerator.tsx
"use client";

import React, { useMemo } from "react";
import { TextField, Box, Typography } from "@mui/material";

import {
  useForm,
  Controller,
  useWatch,
  Control,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QrUrlGeneratorSchema,
  QrUrlFormData,
  defaultQrUrlFormData,
} from "../model/QrUrlGeneratorSchema";

import { useI18n } from "@/shared/i18n/I18nContext";
import { QrCodeDisplay } from "@/shared/ui";

// Этот компонент изолирует useWatch и отображает QR-код.
const QrCodeDisplaySection: React.FC<{
  control: Control<QrUrlFormData>;
  errors: FieldErrors<QrUrlFormData>;
}> = ({ control, errors }) => {
  const { t } = useI18n(); // Получаем функцию перевода

  // 1. Используем useWatch для получения данных.
  const formData = useWatch<QrUrlFormData>({
    control,
    defaultValue: defaultQrUrlFormData,
  }) as QrUrlFormData;

  // Мемоизированные данные для QR-кода
  const qrData = useMemo(() => {
    // Если есть ошибка (например, пустое поле), мы не кодируем данные.
    // Zod вернет нам ошибку, если поле пустое (min(1)).
    if (errors.urlOrText) {
      return "";
    }
    // Если ошибок нет, кодируем значение поля.
    return formData.urlOrText.trim();
  }, [formData, errors.urlOrText]);

  // Определяем текст заглушки/ошибки
  const placeholderKey = errors.urlOrText
    ? (errors.urlOrText.message as "url_error_empty") // Сообщение Zod - это ключ перевода
    : "url_placeholder";

  const placeholderText = t(placeholderKey);

  return (
    <>
      {/* 1. ИСПОЛЬЗУЕМ QrCodeDisplay */}
      <QrCodeDisplay value={qrData} placeholderText={placeholderText} />

      {/* 2. Подпись под QR-кодом */}
      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        {t("url_scan_caption")}
      </Typography>
    </>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export const QrUrlGenerator: React.FC = () => {
  const { t } = useI18n();

  const {
    control,
    formState: { errors },
  } = useForm<QrUrlFormData>({
    resolver: zodResolver(QrUrlGeneratorSchema),
    defaultValues: defaultQrUrlFormData,
    mode: "onChange",
  });

  // Определяем, какой helperText показывать
  const helperTextKey = errors.urlOrText
    ? (errors.urlOrText.message as "url_error_empty")
    : "url_helper_text";

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

      {/* Поле ввода - ИСПОЛЬЗУЕМ CONTROLLER */}
      <Controller
        name="urlOrText"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={t("url_label")}
            variant="outlined"
            margin="normal"
            // Используем сообщение об ошибке от RHF/Zod, если оно есть
            error={!!errors.urlOrText}
            helperText={t(helperTextKey)}
          />
        )}
      />

      {/* Вставляем компонент для QR-кода */}
      <QrCodeDisplaySection control={control} errors={errors} />

      {/* Удалили старую подпись, так как она перенесена в QrCodeDisplaySection */}
    </Box>
  );
};

export default QrUrlGenerator;
