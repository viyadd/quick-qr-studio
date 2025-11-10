// src/app/page.tsx
import { Container, Typography } from "@mui/material";
import { ThemeToggler } from "@/shared/ui";
import { QrCodeTabs } from "@/widgets";

export default function Home() {
  return (
    <div>
      <ThemeToggler />
      <main>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            ⚡ QuickQR Studio
          </Typography>
          <QrCodeTabs />
        </Container>
      </main>
    </div>
  );
}
