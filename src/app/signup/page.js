"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao criar conta");
        return;
      }

      setSuccess("Conta criada com sucesso! Redirecionando...");

      setTimeout(async () => {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
        }
      }, 1500);
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
                <PersonAddIcon color="primary" />
                <Typography variant="h4">Criar Conta</Typography>
              </Stack>

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <form onSubmit={handleSignup}>
                <Stack spacing={2}>
                  <TextField
                    label="Nome"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    helperText="Mínimo 8 caracteres"
                  />
                  <TextField
                    label="Confirmar Senha"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{ position: "relative", mt: 2 }}
                  >
                    {loading && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          left: "50%",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                    <span
                      style={{ visibility: loading ? "hidden" : "visible" }}
                    >
                      Criar Conta
                    </span>
                  </Button>
                </Stack>
              </form>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Já tem conta?{" "}
                <Button
                  variant="text"
                  size="small"
                  href="/login"
                  sx={{ textTransform: "none" }}
                >
                  Faça login
                </Button>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
