import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Finanzapp | Control de Finanzas Personales Inteligente',
  description:
    'App y plataforma web moderna para control de gastos, presupuestos 50/30/20, flujo de caja y sincronización inteligente de bancos en Bolivia e Internacional.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
