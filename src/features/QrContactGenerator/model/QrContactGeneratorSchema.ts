// src/features/QrContactGenerator/model/QrContactGeneratorSchema.ts

import { z } from "zod";
import { TranslationKeys } from "@/shared/i18n/translations";

// --- 1. Схема валидации Zod ---
export const QrContactGeneratorSchema = z
  .object({
    // Основные поля
    firstName: z
      .string()
      .trim()
      .max(100, { message: "contact_error_max_length_100" })
      .optional()
      .or(z.literal("")),
    lastName: z
      .string()
      .trim()
      .max(100, { message: "contact_error_max_length_100" })
      .optional()
      .or(z.literal("")),
    phone: z.string().trim().optional().or(z.literal("")),

    // Необязательные поля
    email: z
      .string()
      .trim()
      .email({ message: "contact_error_invalid_email" })
      .optional()
      .or(z.literal("")),
    company: z
      .string()
      .trim()
      .max(100, { message: "contact_error_max_length_100" })
      .optional()
      .or(z.literal("")),
    title: z
      .string()
      .trim()
      .max(100, { message: "contact_error_max_length_100" })
      .optional()
      .or(z.literal("")),
  })
  // 2. Правило Refine: требуется хотя бы одно идентифицирующее поле
  .refine(
    (data) =>
      !!data.firstName || !!data.lastName || !!data.phone || !!data.email,
    {
      message: "contact_error_empty_data", // Ключ для перевода
      path: ["firstName"], // Привязываем сообщение об ошибке к первому полю для отображения
    }
  );

// --- 3. Тип данных формы (для TypeScript) ---
export type QrContactFormData = z.infer<typeof QrContactGeneratorSchema>;

// --- 3. ФУНКЦИЯ ДЛЯ ЗНАЧЕНИЙ ПО УМОЛЧАНИЮ С ИНТЕРНАЦИОНАЛИЗАЦИЕЙ ---

// Определяем минимальный интерфейс функции t, которая нам нужна
type MinimalTFunction = (key: TranslationKeys) => string;

/**
 * Возвращает объект данных по умолчанию для формы Контакта, используя функцию перевода.
 * @param t - Функция перевода (из useI18n()).
 * @returns Объект QrContactFormData с локализованными значениями.
 */
export const getDefaultQrContactFormData = (
  t: MinimalTFunction
): QrContactFormData => ({
  firstName: t("contact_default_first_name"),
  lastName: t("contact_default_last_name"),
  phone: t("contact_default_phone"),
  email: t("contact_default_email"),
  company: t("contact_default_company"),
  title: t("contact_default_title"),
});

// Примечание: В компоненте QrContactGenerator.tsx нужно будет вызвать getDefaultQrContactFormData(t)
// и передать результат в defaultValues useForm.
export const defaultQrContactFormData: QrContactFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  company: "",
  title: "",
};
