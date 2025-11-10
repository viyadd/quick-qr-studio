// src/features/QrContactGenerator/ui/QrContactGenerator.tsx
"use client";

import React, { useState, useMemo } from "react";
import { TextField, Box, Typography, Paper } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

// Интерфейс для состояния контактных данных
interface ContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
}

/**
 * Функция для формирования строки данных QR-кода в формате MeCard
 * @param data - Объект с контактными данными
 * @returns Строка в формате MECARD:N:Фамилия,Имя;TEL:Телефон;EMAIL:Почта;;
 */
const generateMeCardString = (data: ContactData): string => {
  const parts: string[] = [];

  // 1. Имя (обязательное поле для корректной работы)
  const name = data.lastName.trim() || data.firstName.trim();
  if (name) {
    // Формат: Фамилия,Имя
    const formattedName = `${data.lastName.trim()},${data.firstName.trim()}`;
    parts.push(`N:${formattedName}`);
  }

  // 2. Телефон
  if (data.phone.trim()) {
    parts.push(`TEL:${data.phone.trim()}`);
  }

  // 3. Email
  if (data.email.trim()) {
    parts.push(`EMAIL:${data.email.trim()}`);
  }

  // 4. Компания (ORG)
  if (data.company.trim()) {
    parts.push(`ORG:${data.company.trim()}`);
  }

  // 5. Должность (TITLE)
  if (data.title.trim()) {
    parts.push(`TITLE:${data.title.trim()}`);
  }

  // Если нет данных, возвращаем заглушку
  if (parts.length === 0) {
    return "Введите данные контакта";
  }

  // Собираем финальную строку: префикс + поля + двойной разделитель в конце
  return `MECARD:${parts.join(";")};;`;
};

export const QrContactGenerator: React.FC = () => {
  const [contact, setContact] = useState<ContactData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
  });

  // Обработчик изменения для всех полей
  const handleChange =
    (field: keyof ContactData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContact((prev) => ({ ...prev, [field]: event.target.value }));
    };

  // Мемоизированная строка данных для QR-кода
  const qrData = useMemo(() => {
    return generateMeCardString(contact);
  }, [contact]);

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

  // Определяем, когда показывать QR-код (когда есть хотя бы Фамилия, Имя или Телефон)
  const hasData = contact.lastName || contact.firstName || contact.phone;
  const displayQrCode = hasData ? (
    qrCodeElement
  ) : (
    <Typography color="text.secondary">
      Введите имя или телефон, чтобы сгенерировать QR-код контакта.
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
        Генератор QR-кода для Контакта (MeCard)
      </Typography>

      {/* Сетка для полей ввода */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        }}
      >
        <TextField
          label="Имя (First Name)"
          variant="outlined"
          value={contact.firstName}
          onChange={handleChange("firstName")}
          helperText="Имя, например, 'Иван'"
        />
        <TextField
          label="Фамилия (Last Name)"
          variant="outlined"
          value={contact.lastName}
          onChange={handleChange("lastName")}
          helperText="Фамилия, например, 'Иванов'"
        />
      </Box>

      <TextField
        fullWidth
        label="Телефон"
        variant="outlined"
        value={contact.phone}
        onChange={handleChange("phone")}
        margin="normal"
        type="tel"
        helperText="Номер телефона с кодом страны, например, '+79001234567'"
      />

      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        value={contact.email}
        onChange={handleChange("email")}
        margin="normal"
        type="email"
        helperText="Электронная почта"
      />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          mt: 2,
        }}
      >
        <TextField
          label="Компания (Организация)"
          variant="outlined"
          value={contact.company}
          onChange={handleChange("company")}
          helperText="Название вашей компании"
        />
        <TextField
          label="Должность"
          variant="outlined"
          value={contact.title}
          onChange={handleChange("title")}
          helperText="Ваша должность"
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
        **Кодируемые данные:** {qrData}
      </Typography>

      <Typography
        variant="caption"
        display="block"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        Сканируйте этот код, чтобы добавить контакт!
      </Typography>
    </Box>
  );
};

export default QrContactGenerator;
