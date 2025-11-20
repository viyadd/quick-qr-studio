// src/features/QrEmailSmsGenerator/ui/QrEmailSmsGenerator.tsx
"use client";

import React, { useMemo } from "react";
import {
  TextField,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";

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
  QrEmailSmsGeneratorSchema,
  QrEmailSmsFormData,
  defaultQrEmailSmsFormData,
} from "../model/QrEmailSmsGeneratorSchema";
import { TranslationKeys } from "@/shared/i18n/translations";

type EmailMode = Extract<QrEmailSmsFormData, { mode: "email" }>;
type SmsMode = Extract<QrEmailSmsFormData, { mode: "sms" }>;

/** 1. Кодирование Email */
const generateEmailString = (data: QrEmailSmsFormData): string => {
  const { to, subject, body } = data as Extract<
    QrEmailSmsFormData,
    { mode: "email" }
  >; // Приводим тип

  if (!to.trim()) {
    return ""; // Возвращаем пустую строку для активации заглушки QR-кода
  }

  const encodedSubject = encodeURIComponent(subject?.trim() || "");
  const encodedBody = encodeURIComponent(body?.trim() || "");

  let emailString = `mailto:${to.trim()}`;
  const params: string[] = [];

  if (encodedSubject) {
    params.push(`subject=${encodedSubject}`);
  }
  if (encodedBody) {
    params.push(`body=${encodedBody}`);
  }

  if (params.length > 0) {
    emailString += `?${params.join("&")}`;
  }

  return emailString;
};

/** 2. Кодирование SMS */
const generateSmsString = (data: QrEmailSmsFormData): string => {
  const { phone, body } = data as Extract<QrEmailSmsFormData, { mode: "sms" }>; // Приводим тип

  if (!phone.trim()) {
    return ""; // Возвращаем пустую строку для активации заглушки QR-кода
  }

  const encodedBody = encodeURIComponent(body?.trim() || "");

  // Формат: SMSTO:<номер_телефона>:<текст_сообщения>
  return `SMSTO:${phone.trim()}:${encodedBody}`;
};

// --- ВЛОЖЕННЫЙ КОМПОНЕНТ ДЛЯ QR-КОДА ---
const QrCodeDisplaySection: React.FC<{
  control: Control<QrEmailSmsFormData>;
  errors: FieldErrors<QrEmailSmsFormData>;
}> = ({ control, errors }) => {
  const { t } = useI18n();

  // Отслеживаем ВСЕ поля для генерации QR-кода
  const formData = useWatch<QrEmailSmsFormData>({
    control,
    defaultValue: defaultQrEmailSmsFormData,
  }) as QrEmailSmsFormData;

  // Отслеживаем только режим, чтобы понять, какой раздел ошибок проверять
  const mode = formData.mode;

  const emailErrors = errors as FieldErrors<
    Extract<QrEmailSmsFormData, { mode: "email" }>
  >;
  const smsErrors = errors as FieldErrors<
    Extract<QrEmailSmsFormData, { mode: "sms" }>
  >;

  // Определяем, есть ли ошибки, которые препятствуют кодированию
  const hasEncodingError =
    mode === "email"
      ? !!emailErrors.to // Проверяем обязательное поле 'to'
      : !!smsErrors.phone || !!smsErrors.body; // Проверяем 'phone' и 'body' (для max length)

  const qrData = useMemo(() => {
    // Если есть явная ошибка, мы не кодируем ничего
    if (hasEncodingError) {
      return "";
    }

    // Кодируем данные в зависимости от режима
    return mode === "email"
      ? generateEmailString(formData)
      : generateSmsString(formData);
  }, [formData, mode, hasEncodingError]);

  // Определяем текст заглушки/ошибки
  let placeholderKey: TranslationKeys;

  if (hasEncodingError) {
    if (mode === "email") {
      // Сообщение об ошибке для обязательного поля 'to'
      placeholderKey =
        (emailErrors.to?.message as TranslationKeys) || "url_placeholder";
    } else {
      // Приоритет ошибки: phone (обязательное) > body (длина)
      placeholderKey =
        (smsErrors.phone?.message as TranslationKeys) ||
        (smsErrors.body?.message as TranslationKeys) ||
        "url_placeholder";
    }
  } else {
    placeholderKey = "url_placeholder";
  }

  // Используем i18n
  const placeholderText = t(placeholderKey);

  return (
    <>
      {/* 1. ИСПОЛЬЗУЕМ QrCodeDisplay */}
      <QrCodeDisplay value={qrData} placeholderText={placeholderText} />

      {/* 2. Отображение сгенерированных данных для проверки */}
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
export const QrEmailSmsGenerator: React.FC = () => {
  const { t } = useI18n();

  const {
    control,
    formState: { errors },
  } = useForm<QrEmailSmsFormData>({
    resolver: zodResolver(QrEmailSmsGeneratorSchema),
    defaultValues: defaultQrEmailSmsFormData,
    mode: "onChange",
  });

  // Следим только за режимом (Mode)
  const currentMode = useWatch({ control, name: "mode" });

  const emailErrors = errors as FieldErrors<EmailMode>;
  const smsErrors = errors as FieldErrors<SmsMode>;

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
        {t("generator_email_sms_title")}
      </Typography>

      {/* Переключатель режима - ИСПОЛЬЗУЕМ CONTROLLER */}
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">{t("email_sms_mode_label")}</FormLabel>
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel
                value="email"
                control={<Radio />}
                label="Email"
              />
              <FormControlLabel value="sms" control={<Radio />} label="SMS" />
            </RadioGroup>
          )}
        />
      </FormControl>

      {/* --- Поля для режима EMAIL --- */}
      {currentMode === "email" && (
        <Box sx={{ mt: 2 }}>
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t("email_to_label")}
                variant="outlined"
                margin="normal"
                type="email"
                error={!!emailErrors.to}
                helperText={
                  emailErrors.to
                    ? t(emailErrors.to.message as "email_error_empty_to")
                    : t("email_to_helper")
                }
              />
            )}
          />
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t("email_subject_label")}
                variant="outlined"
                margin="normal"
                helperText={t("email_subject_helper")}
              />
            )}
          />
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t("email_body_label")}
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                helperText={t("email_body_helper")}
              />
            )}
          />
        </Box>
      )}

      {/* --- Поля для режима SMS --- */}
      {currentMode === "sms" && (
        <Box sx={{ mt: 2 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t("sms_phone_label")}
                variant="outlined"
                margin="normal"
                type="tel"
                error={!!smsErrors.phone}
                helperText={
                  smsErrors.phone
                    ? t(smsErrors.phone.message as "sms_error_empty_phone")
                    : t("sms_phone_helper")
                }
              />
            )}
          />
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t("sms_body_label")}
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                inputProps={{ maxLength: 160 }}
                // Здесь комбинируем сообщение об ошибке Zod и счетчик символов
                helperText={
                  smsErrors.body
                    ? t(smsErrors.body.message as "sms_error_max_length")
                    : t("sms_body_helper_length", {
                        current: field.value?.length || 0,
                      })
                }
              />
            )}
          />
        </Box>
      )}

      {/* Вставляем компонент для QR-кода */}
      <QrCodeDisplaySection control={control} errors={errors} />
    </Box>
  );
};

export default QrEmailSmsGenerator;
