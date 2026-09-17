import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/features/auth';
import { ThemeProvider } from '@/context/ThemeContext';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '90-Day CS Mastery',
  description:
    'A structured 90-day curriculum covering algorithms, data structures, and system design. One problem a day, six programming languages.',
  keywords: ['computer science', 'algorithms', 'data structures', 'system design', 'coding challenges'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Geist font — preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased selection:bg-[var(--text-primary)] selection:text-[var(--bg-canvas)]">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
