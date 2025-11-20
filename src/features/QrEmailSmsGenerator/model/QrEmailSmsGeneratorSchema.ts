// src/features/QrEmailSmsGenerator/model/QrEmailSmsGeneratorSchema.ts

import { z } from "zod";

// --- 1. Базовые схемы для режимов ---

// Email: 'to' (Получатель) обязателен, 'subject' и 'body' - необязательны
const EmailSchema = z.object({
  mode: z.literal("email"), // Дискриминантное поле
  to: z.string().trim().min(1, { message: "email_error_empty_to" }), // Ключ для перевода
  subject: z.string().trim().optional().or(z.literal("")),
  body: z.string().trim().optional().or(z.literal("")),
});

// SMS: 'phone' (Номер телефона) обязателен
const SmsSchema = z.object({
  mode: z.literal("sms"), // Дискриминантное поле
  phone: z.string().trim().min(1, { message: "sms_error_empty_phone" }), // Ключ для перевода
  body: z
    .string()
    .trim()
    .max(160, { message: "sms_error_max_length" })
    .optional()
    .or(z.literal("")),
  // Мы можем добавить более строгую проверку номера телефона, но min(1) пока достаточно.
});

// --- 2. Дискриминантное объединение ---
// Zod автоматически проверяет поля в зависимости от значения 'mode'
export const QrEmailSmsGeneratorSchema = z.discriminatedUnion("mode", [
  EmailSchema,
  SmsSchema,
]);

// --- 3. Типы и значения по умолчанию ---
export type QrEmailSmsFormData = z.infer<typeof QrEmailSmsGeneratorSchema>;

export const defaultQrEmailSmsFormData: QrEmailSmsFormData = {
  mode: "email",
  to: "",
  subject: "",
  body: "",
  // Поля SMS также должны быть в default, чтобы RHF их инициализировал.
  // Мы используем безопасное приведение типа, чтобы удовлетворить TS,
  // так как union не может знать, что все поля будут присутствовать одновременно.
  phone: "",
} as QrEmailSmsFormData;
