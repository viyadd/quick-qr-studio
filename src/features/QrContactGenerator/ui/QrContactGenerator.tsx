// src/features/QrContactGenerator/ui/QrContactGenerator.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import { TextField, Box, Typography } from "@mui/material";

import {
  useForm,
  Controller,
  useWatch,
  Control,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/shared/i18n/I18nContext";
import { QrCodeDisplay } from "@/shared/ui";
import {
  QrContactGeneratorSchema,
  QrContactFormData,
  defaultQrContactFormData,
  getDefaultQrContactFormData,
} from "../model/QrContactGeneratorSchema";
import { TranslationKeys } from "@/shared/i18n/translations"; // Для удобства типизации

/**
 * Функция для формирования строки данных QR-кода в формате MeCard
 * @param data - Объект с контактными данными
 * @returns Строка в формате MECARD:N:Фамилия,Имя;TEL:Телефон;EMAIL:Почта;...;;
 */
const generateMeCardString = (data: QrContactFormData): string => {
  const parts: string[] = [];
  const { firstName, lastName, phone, email, company, title } = data;

  // 1. Имя (N)
  const name = lastName?.trim() || firstName?.trim();
  if (name) {
    // Формат: Фамилия,Имя
    const formattedName = `${lastName?.trim()},${firstName?.trim()}`;
    parts.push(`N:${formattedName}`);
  }

  // 2. Телефон (TEL)
  if (phone?.trim()) {
    parts.push(`TEL:${phone.trim()}`);
  }

  // 3. Email (EMAIL)
  if (email?.trim()) {
    parts.push(`EMAIL:${email.trim()}`);
  }

  // 4. Компания (ORG)
  if (company?.trim()) {
    parts.push(`ORG:${company.trim()}`);
  }

  // 5. Должность (TITLE)
  if (title?.trim()) {
    parts.push(`TITLE:${title.trim()}`);
  }

  // 6. День рождения (BDAY) и т.д. можно добавить здесь, если нужны.

  // Если нет ни одной части, возвращаем пустую строку (будет обработано в useMemo)
  if (parts.length === 0) {
    return "";
  }

  // Формат MeCard: MECARD:часть1;часть2;;
  return `MECARD:${parts.join(";")};;`;
};

// --- ВЛОЖЕННЫЙ КОМПОНЕНТ ДЛЯ QR-КОДА ---
const QrCodeDisplaySection: React.FC<{
  control: Control<QrContactFormData>;
  errors: FieldErrors<QrContactFormData>;
}> = ({ control, errors }) => {
  const { t } = useI18n();

  // Отслеживаем ВСЕ поля для генерации QR-кода
  const formData = useWatch<QrContactFormData>({
    control,
    defaultValue: defaultQrContactFormData,
  }) as QrContactFormData;

  const qrData = useMemo(() => {
    // Проверяем наличие общей ошибки от refine (она привязана к firstName)
    const hasRefineError = !!errors.firstName?.message;

    // Если есть ошибка валидации (например, пустые обязательные данные), не кодируем ничего.
    if (hasRefineError) {
      return "";
    }

    // Кодируем данные
    return generateMeCardString(formData);
  }, [formData, errors.firstName?.message]);

  // Определяем текст заглушки/ошибки
  // Приоритет: Общая ошибка Refine (firstName) > Ошибка Email (email) > Плейсхолдер
  const placeholderKey = (errors.firstName?.message ||
    errors.email?.message ||
    "url_placeholder") as TranslationKeys;

  const placeholderText = t(placeholderKey);

  return (
    <>
      <QrCodeDisplay value={qrData} placeholderText={placeholderText} />

      {/* Отображение сгенерированных данных для проверки */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          textAlign: "center",
          color: "text.secondary",
          wordBreak: "break-all",
        }}
      >
        **Кодируемые данные:** {qrData || t("url_placeholder")}
      </Typography>

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
export const QrContactGenerator: React.FC = () => {
  const { t } = useI18n();

  // 1. Рассчитываем локализованные значения по умолчанию
  // Приводим тип t, чтобы TS понимал, что он может принимать TranslationKeys
  const localizedDefaultValues = useMemo(() => {
    return getDefaultQrContactFormData(t as (key: TranslationKeys) => string);
  }, [t]); // <-- Пересчитываем только при смене t (языка)

  const {
    control,
    formState: { errors },
    reset,
  } = useForm<QrContactFormData>({
    resolver: zodResolver(QrContactGeneratorSchema),
    defaultValues: localizedDefaultValues,
    mode: "onChange",
  });

  // 2. Используем useEffect для сброса формы при смене языка
  useEffect(() => {
    // Вызываем reset с новыми локализованными значениями.
    // Это обновит форму RHF, заставив ее использовать новые defaultValues.
    reset(localizedDefaultValues);
  }, [localizedDefaultValues, reset]); // Зависимости: новые значения и сама функция reset

  // Вспомогательная функция для получения текста ошибки
  const getHelperText = (
    fieldName: keyof QrContactFormData,
    defaultKey: TranslationKeys
  ) => {
    const error = errors[fieldName];
    return error ? t(error.message as TranslationKeys) : t(defaultKey);
  };

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
        {t("generator_contact_title")}
      </Typography>

      {/* --- Имя и Фамилия --- */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          mt: 2,
        }}
      >
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("contact_first_name_label")}
              variant="outlined"
              error={!!errors.firstName}
              helperText={getHelperText(
                "firstName",
                "contact_first_name_helper"
              )}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("contact_last_name_label")}
              variant="outlined"
              error={!!errors.lastName}
              helperText={getHelperText("lastName", "contact_last_name_helper")}
            />
          )}
        />
      </Box>

      {/* --- Телефон --- */}
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={t("contact_phone_label")}
            variant="outlined"
            margin="normal"
            type="tel"
            error={!!errors.phone}
            helperText={getHelperText("phone", "contact_phone_helper")}
          />
        )}
      />

      {/* --- Email --- */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={t("contact_email_label")}
            variant="outlined"
            margin="normal"
            type="email"
            error={!!errors.email}
            helperText={getHelperText("email", "contact_email_helper")}
          />
        )}
      />

      {/* --- Компания и Должность --- */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          mt: 2,
        }}
      >
        <Controller
          name="company"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("contact_company_label")}
              variant="outlined"
              error={!!errors.company}
              helperText={getHelperText("company", "contact_company_helper")}
            />
          )}
        />
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("contact_title_label")}
              variant="outlined"
              error={!!errors.title}
              helperText={getHelperText("title", "contact_title_helper")}
            />
          )}
        />
      </Box>

      {/* Вставляем компонент для QR-кода */}
      <QrCodeDisplaySection control={control} errors={errors} />
    </Box>
  );
};

export default QrContactGenerator;
