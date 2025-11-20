// src/shared/i18n/I18nContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { Language, Translations, i18nResources } from "./translations";

// 1. Определяем тип контекста
interface I18nContextType {
  lang: Language;
  t: (
    key: keyof Translations,
    replacements?: Record<string, string | number> // Добавляем тип для переменных
  ) => string;
  setLang: (lang: Language) => void;
}

// Начальное значение контекста
const defaultContext: I18nContextType = {
  lang: "ru", // Язык по умолчанию
  t: (key: keyof Translations) => key, // Заглушка, если провайдер не используется
  setLang: () => {},
};

// 2. Создаем контекст
const I18nContext = createContext<I18nContextType>(defaultContext);

// 3. Создаем провайдер
interface I18nProviderProps {
  children: ReactNode;
  initialLang?: Language;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLang = "ru",
}) => {
  const [lang, setLang] = useState<Language>(initialLang);

  const t = useCallback(
    (
      key: keyof Translations,
      replacements?: Record<string, string | number> // Принимаем переменные
    ): string => {
      // 1. Получаем исходную строку перевода
      let translatedString = i18nResources[lang][key] || key;

      // 2. ЛОГИКА ИНТЕРПОЛЯЦИИ (подстановки переменных)
      if (replacements) {
        // Проходим по всем ключам в объекте replacements (например, 'current')
        for (const placeholderKey in replacements) {
          if (replacements.hasOwnProperty(placeholderKey)) {
            // Преобразуем значение в строку, чтобы избежать ошибок замены
            const value = String(replacements[placeholderKey]);

            // Создаем регулярное выражение для поиска {{current}} или {{ current }}
            // '\s*' позволяет игнорировать пробелы вокруг ключа. 'g' - для замены всех совпадений.
            const regex = new RegExp(`{{\\s*${placeholderKey}\\s*}}`, "g");

            // Заменяем шаблон (например, {{current}}) на фактическое значение
            translatedString = translatedString.replace(regex, value);
          }
        }
      }

      return translatedString;
    },
    [lang]
  );

  // Мемоизируем значение контекста
  const contextValue = useMemo(
    () => ({
      lang,
      t,
      setLang,
    }),
    [lang, t]
  );

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};

// 4. Создаем хук для использования
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
