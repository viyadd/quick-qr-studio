// src/shared/i18n/translations.ts

// Тип для ключей перевода
export type TranslationKeys =
  | "app_title"
  | "tab_url_text"
  | "tab_wifi"
  | "tab_contacts"
  | "tab_email_sms"
  | "generator_url_title"
  | "generator_wifi_title"
  | "generator_contact_title"
  | "generator_email_sms_title"
  | "url_label"
  | "url_helper_text"
  | "url_placeholder"
  | "url_scan_caption"
  | "url_error_invalid"
  | "url_error_empty";

// Тип для языкового словаря
export type Language = "ru" | "en";
export type Translations = Record<TranslationKeys, string>;

// Словари для каждого языка
export const i18nResources: Record<Language, Translations> = {
  ru: {
    app_title: "⚡ QuickQR Studio",
    tab_url_text: "Текст / URL",
    tab_wifi: "Wi-Fi",
    tab_contacts: "Контакты (VCard/MeCard)",
    tab_email_sms: "Email / SMS",
    generator_url_title: "Генератор QR-кода для URL/Текста",
    generator_wifi_title: "Генератор QR-кода для Wi-Fi",
    generator_contact_title: "Генератор QR-кода для Контакта (MeCard)",
    generator_email_sms_title: "Генератор QR-кода для Email или SMS",
    url_label: "Введите URL для кодирования",
    url_helper_text: "Код будет обновляться в реальном времени.",
    url_placeholder: "Введите URL или текст для кодирования",
    url_scan_caption: "Сканируйте этот код, чтобы проверить!",
    url_error_invalid: "Введите корректный URL (например, https://...)",
    url_error_empty: "QR-код будет пустым, если не ввести данные.",
  },
  en: {
    app_title: "⚡ QuickQR Studio",
    tab_url_text: "Text / URL",
    tab_wifi: "Wi-Fi",
    tab_contacts: "Contacts (VCard/MeCard)",
    tab_email_sms: "Email / SMS",
    generator_url_title: "QR Code Generator for URL/Text",
    generator_wifi_title: "QR Code Generator for Wi-Fi",
    generator_contact_title: "QR Code Generator for Contact (MeCard)",
    generator_email_sms_title: "QR Code Generator for Email or SMS",
    url_label: "Enter URL to encode",
    url_helper_text: "The code updates in real-time.",
    url_placeholder: "Enter URL or text to encode",
    url_scan_caption: "Scan this code to check!",
    url_error_invalid: "Please enter a valid URL (e.g., https://...)",
    url_error_empty: "The QR code will be empty if no data is entered.",
  },
};
