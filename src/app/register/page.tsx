'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';
import { fetchPOST } from '@/lib/fetchers';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Cadastrando...');

    try {
      await fetchPOST('/api/auth/register', {
        name,
        email,
        password,
      });
      const login = await signIn('credentials', { redirect: false, password: password, email: email });
      if (login?.error) {
        throw login.error;
      } else {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      if (typeof error === 'string') {
        toast.update(loadingToast, {
          render: error,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      } else if (error instanceof Error) {
        toast.update(loadingToast, {
          render: 'Erro inesperado ocorreu!',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(loadingToast, {
          render:
            error && typeof error === 'object' && 'message' in error && typeof error?.message === 'string'
              ? error.message
              : 'Erro inesperado ocorreu!',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Cadastro
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField label="Nome" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            Cadastrar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
