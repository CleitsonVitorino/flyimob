import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FLY Imob — Controle Financeiro 2026',
  description: 'Dashboard financeiro interno dos sócios',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
