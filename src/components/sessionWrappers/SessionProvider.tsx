'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProviderWrapper = ({ children }: SessionProviderProps) => {
  return <SessionProvider refetchInterval={4 * 60}>{children}</SessionProvider>;
};

export default SessionProviderWrapper;
