// src/features/QrWifiGenerator/ui/QrWifiGenerator.tsx
"use client";

import React, { useMemo } from "react";
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
import {
  QrWifiGeneratorSchema,
  QrWifiFormData,
  defaultQrWifiFormData,
} from "../model/QrWifiGeneratorSchema";
import { QrCodeDisplay } from "@/shared/ui";

// Типы шифрования
const encryptionTypes = [
  { value: "WPA", label: "WPA/WPA2" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "Нет (Без пароля)" },
];

/**
 * Функция для формирования строки данных QR-кода Wi-Fi
 */
const generateWifiString = (data: QrWifiFormData): string => {
  const { ssid, password, encryption, isHidden } = data;

  const type = encryption;
  const passwordPart = type !== "nopass" ? `P:${password?.trim()};` : "";
  const hiddenPart = isHidden ? "H:true;" : "";

  // Формат: WIFI:T:<type>;S:<ssid>;P:<password>;H:<hidden>;
  return `WIFI:T:${type};S:${ssid?.trim()};${passwordPart}${hiddenPart}`;
};

const PasswordInputField: React.FC<{
  control: Control<QrWifiFormData>;
  errors: FieldErrors<QrWifiFormData>;
}> = ({ control, errors }) => {
  const currentEncryption = useWatch({
    control,
    name: "encryption",
  }) as QrWifiFormData["encryption"];
  const isPasswordRequired = currentEncryption !== "nopass";

  return (
    <Controller
      name="password"
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label="Пароль"
          variant="outlined"
          type={isPasswordRequired ? "password" : "text"}
          value={isPasswordRequired ? field.value : "Пароль не требуется"}
          margin="normal"
          disabled={!isPasswordRequired}
          error={!!errors.password}
          helperText={
            errors.password
              ? errors.password.message
              : isPasswordRequired
              ? "Укажите пароль от Wi-Fi сети."
              : "Поле отключено, так как выбран тип 'Нет пароля'."
          }
        />
      )}
    />
  );
};

const QrCodeDisplaySection: React.FC<{
  control: Control<QrWifiFormData>;
  errors: FieldErrors<QrWifiFormData>;
}> = ({ control, errors }) => {
  const formData = useWatch<QrWifiFormData>({
    control,
    defaultValue: defaultQrWifiFormData,
  }) as QrWifiFormData;

  // Мемоизированная строка данных для QR-кода
  const qrData = useMemo(() => {
    // Если есть ошибка в SSID (обязательном поле), возвращаем пустую строку для заглушки
    if (errors.ssid) {
      return "";
    }
    return generateWifiString(formData);
  }, [formData, errors.ssid]);

  // Определяем текст заглушки (Placeholder Text)
  const placeholderText = errors.ssid
    ? errors.ssid.message
    : "Введите имя Wi-Fi сети (SSID)";

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
        **Кодируемые данные:** {qrData || placeholderText}
      </Typography>

      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        Сканируйте этот код, чтобы проверить!
      </Typography>
    </>
  );
};

export const QrWifiGenerator: React.FC = () => {
  const {
    control,
    formState: { errors },
  } = useForm<QrWifiFormData>({
    resolver: zodResolver(QrWifiGeneratorSchema),
    defaultValues: defaultQrWifiFormData,
    mode: "onChange",
  });

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
        Генератор QR-кода для Wi-Fi
      </Typography>

      {/* Поле SSID - ИСПОЛЬЗУЕМ CONTROLLER */}
      <Controller
        name="ssid"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Имя сети (SSID)"
            variant="outlined"
            margin="normal"
            error={!!errors.ssid}
            helperText={
              errors.ssid
                ? errors.ssid.message
                : "Укажите точное имя вашей Wi-Fi сети."
            }
          />
        )}
      />

      {/* Выбор Типа шифрования - ИСПОЛЬЗУЕМ CONTROLLER */}
      <Controller
        name="encryption"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel id="encryption-select-label">Тип шифрования</InputLabel>
            <Select
              {...field}
              labelId="encryption-select-label"
              id="encryption-select"
              label="Тип шифрования"
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

      {/* Вставляем наш новый изолированный компонент для поля пароля */}
      <PasswordInputField control={control} errors={errors} />

      {/* Флажок Скрытая сеть - ИСПОЛЬЗУЕМ CONTROLLER */}
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
              label="Скрытая сеть (Hidden Network)"
            />
          )}
        />
      </Box>

      {/* Вставляем компонент для QR-кода */}
      <QrCodeDisplaySection control={control} errors={errors} />
    </Box>
  );
};

export default QrWifiGenerator;
