// src/features/QrWifiGenerator/ui/QrWifiGenerator.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
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
import { TranslationKeys } from "@/shared/i18n/translations";
import {
  QrWifiGeneratorSchema,
  QrWifiFormData,
  getDefaultQrWifiFormData,
} from "../model/QrWifiGeneratorSchema";

// --- ФУНКЦИЯ КОДИРОВАНИЯ ---

/**
 * Функция для формирования строки данных QR-кода Wi-Fi
 */
const generateWifiString = (data: QrWifiFormData): string => {
  const { ssid, password, encryption, isHidden } = data;

  // Экранирование символов
  const escapeString = (str: string) =>
    str.trim().replace(/([\\;:,])/g, "\\$1");

  const escapedSSID = escapeString(ssid);
  const escapedPassword = escapeString(password);

  const type = encryption;
  const passwordPart = type !== "nopass" ? `P:${escapedPassword};` : "";
  const hiddenPart = isHidden ? "H:true;" : "";

  if (!escapedSSID) {
    return ""; // Не кодируем, если нет SSID
  }

  // Формат: WIFI:T:<type>;S:<ssid>;P:<password>;H:<hidden>;;
  return `WIFI:T:${type};S:${escapedSSID};${passwordPart}${hiddenPart};;`;
};

// --- ВСПОМОГАТЕЛЬНЫЙ КОМПОНЕНТ: Поле пароля (для условной логики) ---
const PasswordInputField: React.FC<{
  control: Control<QrWifiFormData>;
  errors: FieldErrors<QrWifiFormData>;
}> = ({ control, errors }) => {
  const { t } = useI18n();

  // Смотрим за изменением типа шифрования
  const encryption = useWatch({
    control,
    name: "encryption",
    defaultValue: "WPA",
  });

  const isPasswordRequired = encryption !== "nopass";

  // Вспомогательная функция для получения текста ошибки
  const getHelperText = (
    fieldName: keyof QrWifiFormData,
    defaultKey: TranslationKeys
  ) => {
    const error = errors[fieldName];
    return error ? t(error.message as TranslationKeys) : t(defaultKey);
  };

  return (
    <Controller
      name="password"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={t("wifi_password_label")}
          variant="outlined"
          margin="normal"
          type="password"
          disabled={!isPasswordRequired} // Отключаем поле, если тип "Нет пароля"
          error={!!errors.password}
          helperText={
            !isPasswordRequired
              ? t("wifi_password_disabled_helper")
              : getHelperText("password", "wifi_password_helper")
          }
        />
      )}
    />
  );
};

// --- ВСПОМОГАТЕЛЬНЫЙ КОМПОНЕНТ: Отображение QR-кода ---
const QrCodeDisplaySection: React.FC<{
  control: Control<QrWifiFormData>;
  errors: FieldErrors<QrWifiFormData>;
}> = ({ control, errors }) => {
  const { t } = useI18n();

  // Отслеживаем ВСЕ поля
  const formData = useWatch<QrWifiFormData>({ control }) as QrWifiFormData;

  const qrData = useMemo(() => {
    // Если есть ошибки SSID или Password, не кодируем ничего
    if (errors.ssid || errors.password) {
      return "";
    }
    return generateWifiString(formData);
  }, [formData, errors.ssid, errors.password]);

  // Определяем текст заглушки/ошибки
  const hasError = !!errors.ssid || !!errors.password;
  // Если есть ошибка, используем ее ключ, иначе - стандартный плейсхолдер
  const placeholderKey = (
    hasError
      ? errors.ssid?.message || errors.password?.message
      : "url_placeholder"
  ) as TranslationKeys;

  const placeholderText = t(placeholderKey);

  return (
    <>
      <QrCodeDisplay value={qrData} placeholderText={placeholderText} />

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
export const QrWifiGenerator: React.FC = () => {
  const { t } = useI18n();

  // 1. Динамически создаем массив типов шифрования с локализованными метками
  const encryptionTypes = useMemo(
    () => [
      { value: "WPA", label: t("wifi_enc_wpa") },
      { value: "WEP", label: t("wifi_enc_wep") },
      { value: "nopass", label: t("wifi_enc_nopass") },
    ],
    [t]
  );

  // 2. Рассчитываем локализованные значения по умолчанию
  const localizedDefaultValues = useMemo(() => {
    return getDefaultQrWifiFormData(t as (key: TranslationKeys) => string);
  }, [t]);

  const {
    control,
    formState: { errors },
    reset, // Для смены языка
  } = useForm<QrWifiFormData>({
    resolver: zodResolver(QrWifiGeneratorSchema),
    defaultValues: localizedDefaultValues,
    mode: "onChange",
  });

  // 3. Эффект для сброса формы при смене языка
  useEffect(() => {
    reset(localizedDefaultValues);
  }, [localizedDefaultValues, reset]);

  // Вспомогательная функция для получения текста ошибки
  const getHelperText = (
    fieldName: keyof QrWifiFormData,
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
        {t("generator_wifi_title")}
      </Typography>

      {/* --- Поле SSID --- */}
      <Controller
        name="ssid"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label={t("wifi_ssid_label")}
            variant="outlined"
            margin="normal"
            error={!!errors.ssid}
            helperText={getHelperText("ssid", "wifi_ssid_helper")}
          />
        )}
      />

      {/* --- Выбор Типа Шифрования --- */}
      <Controller
        name="encryption"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel id="encryption-select-label">
              {t("wifi_encryption_label")}
            </InputLabel>
            <Select
              {...field}
              labelId="encryption-select-label"
              id="encryption-select"
              label={t("wifi_encryption_label")}
            >
              {encryptionTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {/* --- Поле Пароля (Условный рендеринг и логика) --- */}
      <PasswordInputField control={control} errors={errors} />

      {/* --- Флажок Скрытая сеть --- */}
      <Box sx={{ mt: 2 }}>
        <Controller
          name="isHidden"
          control={control}
          render={({ field: { value, onChange, onBlur, name } }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  onBlur={onBlur}
                  name={name}
                  color="primary"
                />
              }
              label={t("wifi_is_hidden_label")}
            />
          )}
        />
      </Box>

      {/* --- Секция QR-кода --- */}
      <QrCodeDisplaySection control={control} errors={errors} />
    </Box>
  );
};

export default QrWifiGenerator;
