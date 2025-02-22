'use client';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se já estiver autenticado, redireciona para o /dashboard
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading('Logando...');

    try {
      const res = await signIn('credentials', { redirect: false, password: password, email: email });

      if (res?.error) {
        throw res?.error;
      }

      toast.update(loadingToast, {
        render: 'Login realizado com sucesso! 🎉',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error: unknown) {
      toast.update(loadingToast, {
        render: typeof error === 'string' ? error : 'Erro inesperado.',
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
