// src/shared/i18n/translations.ts

// Тип для ключей перевода
export type TranslationKeys =
  | "app_title"
  | "tab_url_text"
  | "tab_wifi"
  | "tab_contacts"
  | "tab_email_sms"
  | "tab_about_app"
  | "generator_url_title"
  | "generator_wifi_title"
  | "generator_contact_title"
  | "generator_email_sms_title"
  | "url_label"
  | "url_helper_text"
  | "url_placeholder"
  | "url_scan_caption"
  | "url_error_invalid"
  | "url_error_empty"
  | "wifi_ssid_required"
  | "wifi_ssid_max_length"
  | "wifi_password_required"
  | "wifi_ssid_label"
  | "wifi_password_label"
  | "wifi_encryption_label"
  | "wifi_is_hidden_label"
  | "wifi_ssid_helper"
  | "wifi_password_helper"
  | "wifi_password_disabled_helper"
  | "wifi_enc_wpa"
  | "wifi_enc_wep"
  | "wifi_enc_nopass"
  | "wifi_error_ssid_required"
  | "wifi_error_ssid_max_length"
  | "wifi_error_password_required"
  | "wifi_default_ssid"
  | "wifi_default_password"
  | "email_sms_mode_label"
  | "email_to_label"
  | "email_subject_label"
  | "email_body_label"
  | "email_to_helper"
  | "email_subject_helper"
  | "email_body_helper"
  | "email_error_empty_to"
  | "sms_error_empty_phone"
  | "sms_error_max_length"
  | "sms_phone_label"
  | "sms_body_label"
  | "sms_phone_helper"
  | "sms_body_helper_length"
  | "contact_first_name_label"
  | "contact_last_name_label"
  | "contact_phone_label"
  | "contact_email_label"
  | "contact_company_label"
  | "contact_title_label"
  | "contact_first_name_helper"
  | "contact_last_name_helper"
  | "contact_phone_helper"
  | "contact_email_helper"
  | "contact_company_helper"
  | "contact_title_helper"
  | "contact_error_empty_data"
  | "contact_error_invalid_email"
  | "contact_error_max_length_100"
  | "contact_default_first_name"
  | "contact_default_last_name"
  | "contact_default_phone"
  | "contact_default_email"
  | "contact_default_company"
  | "contact_default_title";

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
    tab_about_app: "About App",
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
    // --- WI-FI ---
    wifi_ssid_required: "Имя сети (SSID) не может быть пустым.",
    wifi_ssid_max_length: "SSID должен быть короче 32 символов.",
    wifi_password_required: "Пароль обязателен для выбранного типа шифрования.",
    wifi_ssid_label: "Имя сети (SSID)",
    wifi_password_label: "Пароль",
    wifi_encryption_label: "Тип шифрования",
    wifi_is_hidden_label: "Скрытая сеть (Hidden Network)",

    wifi_ssid_helper: "Имя Wi-Fi сети. Обязательное поле.",
    wifi_password_helper: "Пароль от Wi-Fi сети. Обязателен для WPA/WEP.",
    wifi_password_disabled_helper:
      "Поле отключено, так как выбран тип 'Нет пароля'.",

    wifi_enc_wpa: "WPA/WPA2",
    wifi_enc_wep: "WEP",
    wifi_enc_nopass: "Нет (Без пароля)",

    // Ошибки Zod (заменяют старые hardcoded строки)
    wifi_error_ssid_required: "Имя сети (SSID) не может быть пустым.",
    wifi_error_ssid_max_length: "SSID должен быть короче 32 символов.",
    wifi_error_password_required:
      "Пароль обязателен для выбранного типа шифрования.",

    // Значения по умолчанию
    wifi_default_ssid: "My Home Wi-Fi",
    wifi_default_password: "mysecretpassword123",
    // EMAIL/SMS
    email_sms_mode_label: "Выберите тип QR-кода",
    email_to_label: "Email получателя (обязательно)",
    email_subject_label: "Тема письма (необязательно)",
    email_body_label: "Текст письма (необязательно)",
    email_to_helper: "Адрес, на который будет отправлено письмо.",
    email_subject_helper: "Тема письма (необязательно).",
    email_body_helper: "Текст письма (необязательно).",
    email_error_empty_to: "Введите корректный адрес Email.",

    sms_phone_label: "Номер телефона (обязательно)",
    sms_body_label: "Текст SMS-сообщения (необязательно)",
    sms_phone_helper: "Номер телефона, на который будет отправлено SMS.",
    sms_body_helper_length: "Максимум 160 символов. Текущая длина: {{current}}", // Пример с интерполяцией
    sms_error_empty_phone: "Введите номер телефона.",
    sms_error_max_length: "Сообщение SMS не должно превышать 160 символов.",
    // --- CONTACT ---
    contact_first_name_label: "Имя (обязательно)",
    contact_last_name_label: "Фамилия (обязательно)",
    contact_phone_label: "Телефон",
    contact_email_label: "Email",
    contact_company_label: "Компания",
    contact_title_label: "Должность",

    contact_first_name_helper: "Ваше имя.",
    contact_last_name_helper: "Ваша фамилия.",
    contact_phone_helper: "Номер телефона.",
    contact_email_helper: "Электронная почта.",
    contact_company_helper: "Название компании.",
    contact_title_helper: "Ваша должность.",

    contact_default_first_name: "Иван",
    contact_default_last_name: "Иванов",
    contact_default_phone: "+7 (999) 123-45-67",
    contact_default_email: "ivanov@quickqr.com",
    contact_default_company: "QuickQR Studio",
    contact_default_title: "Программист",

    // Ошибки Zod
    contact_error_empty_data:
      "Введите хотя бы имя, фамилию, телефон или email для создания контакта.",
    contact_error_invalid_email: "Введите корректный адрес электронной почты.",
    contact_error_max_length_100: "Максимальная длина поля 100 символов.",
  },
  en: {
    app_title: "⚡ QuickQR Studio",
    tab_url_text: "Text / URL",
    tab_wifi: "Wi-Fi",
    tab_contacts: "Contacts (VCard/MeCard)",
    tab_email_sms: "Email / SMS",
    tab_about_app: "About App",
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

    // --- WI-FI ---
    wifi_ssid_required: "Network Name (SSID) cannot be empty.",
    wifi_ssid_max_length: "SSID must be shorter than 32 characters.",
    wifi_password_required:
      "Password is required for the selected encryption type.",
    wifi_ssid_label: "Network Name (SSID)",
    wifi_password_label: "Password",
    wifi_encryption_label: "Encryption Type",
    wifi_is_hidden_label: "Hidden Network",

    wifi_ssid_helper: "The name of the Wi-Fi network. Required field.",
    wifi_password_helper: "The Wi-Fi password. Required for WPA/WEP.",
    wifi_password_disabled_helper: "Field disabled because 'None' is selected.",

    wifi_enc_wpa: "WPA/WPA2",
    wifi_enc_wep: "WEP",
    wifi_enc_nopass: "None (No password)",

    // Zod Errors
    wifi_error_ssid_required: "Network Name (SSID) cannot be empty.",
    wifi_error_ssid_max_length: "SSID must be shorter than 32 characters.",
    wifi_error_password_required:
      "Password is required for the selected encryption type.",

    // Значения по умолчанию
    wifi_default_ssid: "My Home Wi-Fi",
    wifi_default_password: "mysecretpassword123",

    // EMAIL/SMS
    email_sms_mode_label: "Select QR Code Type",
    email_to_label: "Recipient Email (required)",
    email_subject_label: "Email Subject (optional)",
    email_body_label: "Email Body (optional)",
    email_to_helper: "The address to which the email will be sent.",
    email_subject_helper: "The subject line of the email (optional).",
    email_body_helper: "The body text of the email (optional).",
    email_error_empty_to: "Please enter a valid recipient Email address.",

    sms_phone_label: "Phone Number (required)",
    sms_body_label: "SMS Message Text (optional)",
    sms_phone_helper: "The phone number to which the SMS will be sent.",
    sms_body_helper_length:
      "Maximum 160 characters. Current length: {{current}}",
    sms_error_empty_phone: "Please enter a phone number.",
    sms_error_max_length: "The SMS message should not exceed 160 characters.",

    // --- CONTACT ---
    contact_first_name_label: "First Name (Required)",
    contact_last_name_label: "Last Name (Required)",
    contact_phone_label: "Phone",
    contact_email_label: "Email",
    contact_company_label: "Company",
    contact_title_label: "Title",

    contact_first_name_helper: "Your first name.",
    contact_last_name_helper: "Your last name.",
    contact_phone_helper: "Phone number.",
    contact_email_helper: "Email address.",
    contact_company_helper: "Company name.",
    contact_title_helper: "Your job title.",

    // Zod Errors
    contact_error_empty_data:
      "Please enter at least a name, phone, or email to create a contact.",
    contact_error_invalid_email: "Please enter a valid email address.",
    contact_error_max_length_100: "Maximum field length is 100 characters.",

    contact_default_first_name: "John",
    contact_default_last_name: "Doe",
    contact_default_phone: "+1 (555) 555-0123",
    contact_default_email: "john.doe@quickqr.com",
    contact_default_company: "QuickQR Studio Inc.",
    contact_default_title: "Software Engineer",
  },
};
