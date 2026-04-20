import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotechann Admin',
  description: 'Painel interno — ERP/MRP/CRM da Hotechann Faz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
