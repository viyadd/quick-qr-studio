// src/app/page.tsx
"use client";

import { Container, Typography } from "@mui/material";
import { LanguageToggle, ThemeToggler } from "@/shared/ui";
import { QrCodeTabs } from "@/widgets";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function Home() {
  const { t } = useI18n();

  return (
    <div>
      <ThemeToggler />
      <LanguageToggle />
      <main>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            {t("app_title")}
          </Typography>
          <QrCodeTabs />
        </Container>
      </main>
    </div>
  );
}
