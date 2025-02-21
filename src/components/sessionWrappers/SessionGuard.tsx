'use client';

import { ReactElement, ReactNode, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

interface SessionGuardProps {
  children: ReactNode;
}

export default function SessionGuard({ children }: SessionGuardProps) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('credentials', { callbackUrl: '/dashboard' });
    }
  }, [status]);

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  return <>{children}</>;
}
