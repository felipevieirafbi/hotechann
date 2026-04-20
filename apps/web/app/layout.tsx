import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hotechann Faz — Produtos de Limpeza Profissionais',
  description:
    'Fábrica de produtos de limpeza com atendimento B2B, representantes e licitações.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
