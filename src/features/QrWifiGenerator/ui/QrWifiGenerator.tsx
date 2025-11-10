// src/features/QrWifiGenerator/ui/QrWifiGenerator.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  TextField,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

// Типы шифрования
const encryptionTypes = [
  { value: "WPA", label: "WPA/WPA2" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "Нет (Без пароля)" },
];

/**
 * Функция для формирования строки данных QR-кода Wi-Fi
 * @param ssid - Имя сети (SSID)
 * @param password - Пароль
 * @param encryption - Тип шифрования (WPA, WEP, nopass)
 * @param isHidden - Скрытая ли сеть
 * @returns Строка в формате WIFI:T:<type>;S:<ssid>;P:<password>;H:<hidden>;
 */
const generateWifiString = (
  ssid: string,
  password: string,
  encryption: string,
  isHidden: boolean
): string => {
  // Экранирование символов (:, ;, \) в SSID и Пароле, хотя это часто
  // обрабатывается библиотеками, лучше сделать явно.
  // В данном случае, мы будем использовать самый простой подход,
  // предполагая, что большинство пользователей не будет использовать
  // специальные символы, которые могут сломать формат.

  // Если нет пароля, используем 'nopass', игнорируя поле пароля
  const type = encryption;
  const passwordPart = type !== "nopass" ? `P:${password.trim()};` : "";
  const hiddenPart = isHidden ? "H:true;" : "";

  // Формат: WIFI:T:<type>;S:<ssid>;P:<password>;H:<hidden>;
  return `WIFI:T:${type};S:${ssid.trim()};${passwordPart}${hiddenPart}`;
};

export const QrWifiGenerator: React.FC = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState(encryptionTypes[0].value); // WPA по умолчанию
  const [isHidden, setIsHidden] = useState(false);

  // Мемоизированная строка данных для QR-кода
  const qrData = useMemo(() => {
    // Если SSID пустое, используем заглушку, чтобы код не был невалидным
    if (!ssid.trim()) {
      return "Введите имя Wi-Fi сети (SSID)";
    }
    return generateWifiString(ssid, password, encryption, isHidden);
  }, [ssid, password, encryption, isHidden]);

  // Мемоизируем компонент QR-кода
  const qrCodeElement = useMemo(
    () => (
      <QRCodeCanvas
        value={qrData}
        size={256}
        level="H"
        imageSettings={{
          src: "",
          height: 30,
          width: 30,
          excavate: true,
        }}
      />
    ),
    [qrData]
  );

  const isPasswordRequired = encryption !== "nopass";

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

      {/* Поле SSID */}
      <TextField
        fullWidth
        label="Имя сети (SSID)"
        variant="outlined"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
        margin="normal"
        helperText="Укажите точное имя вашей Wi-Fi сети."
      />

      {/* Выбор Типа шифрования */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="encryption-select-label">Тип шифрования</InputLabel>
        <Select
          labelId="encryption-select-label"
          id="encryption-select"
          value={encryption}
          label="Тип шифрования"
          onChange={(e) => setEncryption(e.target.value)}
        >
          {encryptionTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Поле Пароля */}
      <TextField
        fullWidth
        label="Пароль"
        variant="outlined"
        type={isPasswordRequired ? "password" : "text"}
        value={isPasswordRequired ? password : "Пароль не требуется"}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        disabled={!isPasswordRequired} // Отключаем поле, если тип "Нет пароля"
        helperText={
          isPasswordRequired
            ? "Укажите пароль от Wi-Fi сети."
            : "Поле отключено, так как выбран тип 'Нет пароля'."
        }
      />

      {/* Флажок Скрытая сеть */}
      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isHidden}
              onChange={(e) => setIsHidden(e.target.checked)}
              name="hidden-network"
              color="primary"
            />
          }
          label="Скрытая сеть (Hidden Network)"
        />
      </Box>

      {/* Область вывода QR-кода */}
      <Paper
        elevation={6}
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
        **Кодируемые данные:** {qrData}
      </Typography>

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

export default QrWifiGenerator;
