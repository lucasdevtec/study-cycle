'use client';

import { ReactNode, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

interface SessionGuardProps {
  children: ReactNode;
}

export default function SessionGuard({ children }: SessionGuardProps) {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  return <>{children}</>;
}
