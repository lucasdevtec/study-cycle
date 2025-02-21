import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ToastContainer, toast } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import SessionGuard from '@/components/sessionWrappers/SessionGuard';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ciclos de Estudo',
  description: 'Organize seus estudos com Flexibilidade.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ToastContainer />
        <SessionProvider>
          <SessionGuard>
            <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          </SessionGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
