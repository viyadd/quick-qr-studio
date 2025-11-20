// src/features/QrWifiGenerator/model/QrWifiGeneratorSchema.ts

import { z } from "zod";
import { TranslationKeys } from "@/shared/i18n/translations";

// Типы шифрования
export const EncryptionTypeSchema = z.union([
  z.literal("WPA"),
  z.literal("WEP"),
  z.literal("nopass"),
]);

/**
 * Схема валидации для формы генератора QR-кода Wi-Fi.
 * Zod-сообщения заменены на ключи i18n.
 */
export const QrWifiGeneratorSchema = z
  .object({
    ssid: z
      .string()
      .trim()
      .min(1, { message: "wifi_error_ssid_required" as TranslationKeys }) // Ключ i18n
      .max(32, { message: "wifi_error_ssid_max_length" as TranslationKeys }), // Ключ i18n
    password: z.string().trim(),
    encryption: EncryptionTypeSchema,
    isHidden: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Условная валидация: Пароль обязателен, если шифрование WPA или WEP
    if (data.encryption !== "nopass" && data.password.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "wifi_error_password_required" as TranslationKeys, // Ключ i18n
        path: ["password"],
      });
    }
  });

// --- 2. Тип данных формы ---
export type QrWifiFormData = z.infer<typeof QrWifiGeneratorSchema>;

// --- 3. ФУНКЦИЯ ДЛЯ ЗНАЧЕНИЙ ПО УМОЛЧАНИЮ С ИНТЕРНАЦИОНАЛИЗАЦИЕЙ ---

type MinimalTFunction = (key: TranslationKeys) => string;

/**
 * Возвращает объект данных по умолчанию для формы Wi-Fi, используя функцию перевода.
 */
export const getDefaultQrWifiFormData = (
  t: MinimalTFunction
): QrWifiFormData => ({
  ssid: t("wifi_default_ssid"),
  password: t("wifi_default_password"),
  encryption: "WPA",
  isHidden: false,
});

// Экспортируем пустые данные по умолчанию для RHF, если функция t недоступна
export const defaultQrWifiFormData: QrWifiFormData = {
  ssid: "",
  password: "",
  encryption: "WPA",
  isHidden: false,
};
