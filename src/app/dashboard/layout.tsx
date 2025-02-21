import SessionGuard from '@/components/sessionWrappers/SessionGuard';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionGuard>
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </SessionGuard>
  );
}
