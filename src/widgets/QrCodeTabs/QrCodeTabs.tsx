// src/widgets/QrCodeTabs/QrCodeTabs.tsx
"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import {
  QrContactGenerator,
  QrEmailSmsGenerator,
  QrUrlGenerator,
  QrWifiGenerator,
} from "@/features";
import { useI18n } from "@/shared/i18n/I18nContext";

// Определяем пропсы для компонента TabPanel (для удобства)
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Вспомогательный компонент для отображения содержимого вкладки
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {/* Отображаем содержимое, только если вкладка активна */}
      {value === index && <Box sx={{ p: 0, pt: 2 }}>{children}</Box>}
    </div>
  );
}

// Вспомогательная функция для проставления атрибутов доступности
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const QrCodeTabs: React.FC = () => {
  const { t } = useI18n();
  const [value, setValue] = useState(0);

  // Обработчик смены вкладки
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Paper elevation={3} sx={{ my: 4, p: 0 }}>
      {/* Контейнер для навигации вкладок */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Типы QR-кодов"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t("tab_url_text")} {...a11yProps(0)} />
          <Tab label={t("tab_wifi")} {...a11yProps(1)} />
          <Tab label={t("tab_contacts")} {...a11yProps(2)} />
          <Tab label={t("tab_email_sms")} {...a11yProps(3)} />
        </Tabs>
      </Box>

      {/* Контент вкладок */}
      <Box sx={{ p: 2 }}>
        {/* Вкладка 1: Текст / URL */}
        <TabPanel value={value} index={0}>
          <QrUrlGenerator />
        </TabPanel>

        {/* Вкладка 2: Wi-Fi */}
        <TabPanel value={value} index={1}>
          <QrWifiGenerator />
        </TabPanel>

        {/* Вкладка 3: Контакты */}
        <TabPanel value={value} index={2}>
          <QrContactGenerator />
        </TabPanel>

        {/* Вкладка 4: Email / SMS */}
        <TabPanel value={value} index={3}>
          <QrEmailSmsGenerator />
        </TabPanel>
      </Box>
    </Paper>
  );
};

export default QrCodeTabs;
