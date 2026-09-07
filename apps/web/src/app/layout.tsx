import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '90-Day CS Mastery Roadmap',
  description: 'Learn core computer science concepts, algorithms, and system design in 90 days.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
