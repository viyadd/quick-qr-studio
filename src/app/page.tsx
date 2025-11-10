// src/app/page.tsx
import { Container, Typography } from "@mui/material";
import URLGenerator from "@/shared/ui/URLGenerator";
import { ThemeToggler } from "@/shared/ui";

export default function Home() {
  return (
    <div>
      <ThemeToggler />
      <main>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            ⚡ QuickQR Studio
          </Typography>
          <URLGenerator />
          {/* Здесь будут другие генераторы позже */}
        </Container>
      </main>
    </div>
  );
}
