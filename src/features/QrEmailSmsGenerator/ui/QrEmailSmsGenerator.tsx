// src/features/QrEmailSmsGenerator/ui/QrEmailSmsGenerator.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  TextField,
  Box,
  Typography,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

// Типы режима генерации
type GeneratorMode = "email" | "sms";

// Функции для кодирования данных
// 1. Кодирование Email
const generateEmailString = (
  to: string,
  subject: string,
  body: string
): string => {
  if (!to.trim()) {
    return "Введите адрес получателя";
  }
  // Кодируем URL-параметры
  const encodedSubject = encodeURIComponent(subject.trim());
  const encodedBody = encodeURIComponent(body.trim());

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

// 2. Кодирование SMS
const generateSmsString = (phone: string, body: string): string => {
  if (!phone.trim()) {
    return "Введите номер телефона";
  }
  // Кодируем URL-параметры
  const encodedBody = encodeURIComponent(body.trim());

  // Формат: SMSTO:<номер_телефона>:<текст_сообщения>
  return `SMSTO:${phone.trim()}:${encodedBody}`;
};

export const QrEmailSmsGenerator: React.FC = () => {
  const [mode, setMode] = useState<GeneratorMode>("email");
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [smsPhone, setSmsPhone] = useState("");
  const [smsBody, setSmsBody] = useState("");

  // Мемоизированная строка данных для QR-кода
  const qrData = useMemo(() => {
    if (mode === "email") {
      return generateEmailString(emailTo, emailSubject, emailBody);
    } else {
      return generateSmsString(smsPhone, smsBody);
    }
  }, [mode, emailTo, emailSubject, emailBody, smsPhone, smsBody]);

  // Определяем, есть ли валидные данные для отображения QR-кода
  const hasData = useMemo(() => {
    if (mode === "email") {
      // Для Email достаточно только адреса
      return emailTo.trim().length > 0;
    } else {
      // Для SMS достаточно только номера
      return smsPhone.trim().length > 0;
    }
  }, [mode, emailTo, smsPhone]);

  // Мемоизируем компонент QR-кода
  const qrCodeElement = useMemo(
    () => (
      <QRCodeCanvas
        // Если нет данных, показываем заглушку, иначе - QR-код
        value={hasData ? qrData : "Введите необходимые данные"}
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
    [qrData, hasData]
  );

  // Отображаемый контент QR-кода
  const displayQrCode = hasData ? (
    qrCodeElement
  ) : (
    <Typography color="text.secondary">
      Введите **{mode === "email" ? "адрес Email" : "номер телефона"}** для
      генерации QR-кода.
    </Typography>
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
        Генератор QR-кода для Email или SMS
      </Typography>

      {/* Переключатель режима */}
      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">Выберите тип QR-кода:</FormLabel>
        <RadioGroup
          row
          value={mode}
          onChange={(e) => setMode(e.target.value as GeneratorMode)}
        >
          <FormControlLabel value="email" control={<Radio />} label="Email" />
          <FormControlLabel value="sms" control={<Radio />} label="SMS" />
        </RadioGroup>
      </FormControl>

      {/* --- Поля для режима EMAIL --- */}
      {mode === "email" && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email получателя"
            variant="outlined"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            margin="normal"
            type="email"
            helperText="Обязательно: адрес, на который будет отправлено письмо."
          />
          <TextField
            fullWidth
            label="Тема письма"
            variant="outlined"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Текст письма (необязательно)"
            variant="outlined"
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
        </Box>
      )}

      {/* --- Поля для режима SMS --- */}
      {mode === "sms" && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Номер телефона"
            variant="outlined"
            value={smsPhone}
            onChange={(e) => setSmsPhone(e.target.value)}
            margin="normal"
            type="tel"
            helperText="Обязательно: номер телефона, на который будет отправлено SMS."
          />
          <TextField
            fullWidth
            label="Текст SMS-сообщения (необязательно)"
            variant="outlined"
            value={smsBody}
            onChange={(e) => setSmsBody(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            inputProps={{ maxLength: 160 }} // Ограничение на длину SMS
            helperText={`Максимум 160 символов. Текущая длина: ${smsBody.length}`}
          />
        </Box>
      )}

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
        {displayQrCode}
      </Paper>

      <Typography
        variant="body2"
        sx={{
          mt: 2,
          textAlign: "center",
          color: "text.secondary",
          wordBreak: "break-all",
        }}
      >
        **Кодируемые данные:** {hasData ? qrData : "Нет данных для кодирования"}
      </Typography>

      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        Сканируйте этот код, чтобы быстро отправить{" "}
        {mode === "email" ? "письмо" : "SMS"}!
      </Typography>
    </Box>
  );
};

export default QrEmailSmsGenerator;
