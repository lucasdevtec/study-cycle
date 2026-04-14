"use client";

import LockOutlineIcon from "@mui/icons-material/LockOutline";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppHeader from "@/components/layout/AppHeader";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(170deg, #f3fbf8 0%, #ffffff 60%)",
      }}
    >
      <AppHeader />
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card sx={{ border: "1px solid #d9ebe4" }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LockOutlineIcon color="primary" />
                <Typography variant="h4">Entrar no StudyCycle</Typography>
              </Stack>
              <TextField label="Email" type="email" fullWidth />
              <TextField label="Senha" type="password" fullWidth />
              <Button variant="contained" size="large">
                Entrar
              </Button>
              <Typography variant="body2" color="text.secondary">
                A autenticacao sera conectada com API posteriormente. Esta tela
                ja esta pronta para o fluxo visual.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
