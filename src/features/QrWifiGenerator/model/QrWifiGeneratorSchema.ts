// src/features/QrWifiGenerator/model/QrWifiGeneratorSchema.ts

import { z } from "zod";

// Типы шифрования, которые используются в QrWifiGenerator.tsx
// 'WPA', 'WEP', 'nopass'
export const EncryptionTypeSchema = z.union([
  z.literal("WPA"),
  z.literal("WEP"),
  z.literal("nopass"),
]);

/**
 * Схема валидации для формы генератора QR-кода Wi-Fi.
 *
 * Мы используем 'refine' (уточнение) Zod для условной валидации:
 * Пароль обязателен, если тип шифрования не 'nopass'.
 */
export const QrWifiGeneratorSchema = z
  .object({
    ssid: z
      .string()
      .trim()
      .min(1, "SSID не может быть пустым")
      .max(32, "SSID должен быть короче 32 символов"), // Стандартное ограничение для SSID
    password: z.string().trim(),
    encryption: EncryptionTypeSchema,
    isHidden: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Условная валидация: Пароль обязателен, если шифрование WPA или WEP
    if (data.encryption !== "nopass" && data.password.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Пароль обязателен для выбранного типа шифрования.",
        path: ["password"],
      });
    }
  });

// Тип данных формы, автоматически выведенный из схемы Zod
export type QrWifiFormData = z.infer<typeof QrWifiGeneratorSchema>;

/**
 * Значения по умолчанию для формы.
 * Важно: они должны соответствовать типу QrWifiFormData
 */
export const defaultQrWifiFormData: QrWifiFormData = {
  ssid: "",
  password: "",
  encryption: "WPA",
  isHidden: false,
};
