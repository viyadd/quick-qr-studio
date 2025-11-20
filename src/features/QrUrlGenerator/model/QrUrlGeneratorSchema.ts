// src/features/QrUrlGenerator/model/QrUrlGeneratorSchema.ts

import { z } from "zod";

// --- 1. Схема валидации Zod ---
export const QrUrlGeneratorSchema = z.object({
  // urlOrText - единое поле для ввода URL или произвольного текста
  urlOrText: z.string().trim().min(1, { message: "url_error_empty" }), // Ключ для перевода
  // Здесь можно добавить refine для проверки URL, но
  // для универсального генератора "URL/Текст" это не всегда нужно.
  // Оставим проверку URL для формы.
});

// --- 2. Тип данных формы (для TypeScript) ---
export type QrUrlFormData = z.infer<typeof QrUrlGeneratorSchema>;

// --- 3. Значения по умолчанию ---
export const defaultQrUrlFormData: QrUrlFormData = {
  urlOrText: "https://example.com",
};
