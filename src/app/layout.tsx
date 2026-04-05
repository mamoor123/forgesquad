import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ForgeSquad — Multi-Agent Dev Team Orchestrator',
  description:
    'A web dashboard that orchestrates a 5-agent dev team to plan, review, code, and test software projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0e1a] text-white antialiased">{children}</body>
    </html>
  );
}
