'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Button, Box } from '@mui/material';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();

  const errorMessage = {
    Configuration: 'Erro de configuração no provedor de autenticação.',
    AccessDenied: 'Acesso negado. Você não tem permissão para acessar este recurso.',
    CredentialsSignin: 'Falha ao autenticar. Verifique suas credenciais e tente novamente.',
    default: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Erro ao Logar
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {errorMessage[error as keyof typeof errorMessage] || errorMessage.default}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/auth/signin')}>
          Voltar ao Login
        </Button>
      </Box>
    </Container>
  );
}
