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
  t: (key: keyof Translations) => string; // Функция перевода
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
    (key: keyof Translations): string => {
      // Здесь используем lang
      return i18nResources[lang][key] || key;
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
