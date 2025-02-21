'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Cadastrando...');

    try {
      const res = await signIn('Credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
      });

      toast.update(loadingToast, {
        render: 'Cadastro realizado com sucesso! 🎉',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.update(loadingToast, {
        render: error.message || 'Erro inesperado.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            Entrar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
