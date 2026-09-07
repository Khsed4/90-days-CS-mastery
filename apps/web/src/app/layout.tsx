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
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
