'use client';

import React, { useState } from 'react';
import { useAuth, OtpVerificationModal } from '@/features/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translations } from '@/lib/translations';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function LoginPage() {
  const { login, handleAuthSuccess } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  const t = translations.en;

  const routeByRole = (userRole?: string) => {
    if (userRole === 'ADMIN') router.push('/admin');
    else if (userRole === 'ORGANIZATION') router.push('/organization');
    else router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login(email, password);
      if (res.requiresEmailVerification) {
        setShowOtpModal(true);
      } else {
        routeByRole(res.user?.role);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSuccess = (authData: any) => {
    handleAuthSuccess(authData);
    setShowOtpModal(false);
    routeByRole(authData.user?.role);
  };

  return (
    <div className="min-h-[100dvh] flex">
      {/* Left panel — decorative, hidden on mobile */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] flex-col justify-between bg-[var(--text-primary)] text-[var(--bg-canvas)] p-10 relative overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(var(--bg-canvas) 1px, transparent 1px), linear-gradient(90deg, var(--bg-canvas) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Brand */}
        <Link href="/" className="relative inline-flex items-center gap-2.5 w-fit group">
          <div className="w-7 h-7 rounded-md bg-[var(--bg-canvas)] text-[var(--text-primary)] flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight">CS Mastery</span>
        </Link>

        {/* Middle content */}
        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold tracking-tight leading-snug">
            90 days.<br/>
            One problem a day.<br/>
            Build the intuition.
          </h2>
          <p className="text-sm text-[var(--bg-hover)] leading-relaxed max-w-[38ch]">
            A structured curriculum covering algorithms, data structures, and system design — with interactive workspaces in 6 languages.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-8 pt-2">
            {[
              { value: '90', label: 'challenges' },
              { value: '6', label: 'languages' },
              { value: '12', label: 'categories' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-mono text-xl font-bold">{value}</div>
                <div className="text-[11px] text-[var(--text-faint)]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-[11px] text-[var(--text-muted)]">
          Days 1–3 are free — no account needed.
        </p>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[var(--bg-canvas)] relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm space-y-7">
          {/* Mobile brand (hidden on desktop) */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[var(--text-primary)] text-[var(--bg-canvas)] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
              </svg>
            </div>
            <span className="font-semibold text-sm">CS Mastery</span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Sign in</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              No account?{' '}
              <Link href="/register" className="text-[var(--accent)] hover:underline underline-offset-2">
                Create one
              </Link>
            </p>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-700 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">{t.email}</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[var(--text-secondary)]">{t.password}</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 text-sm rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-[var(--text-primary)] hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {submitting ? 'Signing in…' : t.login}
            </button>
          </form>

          <div className="pt-1 border-t border-[var(--border-subtle)]">
            <Link
              href="/"
              className="block text-center text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors pt-3"
            >
              ← Continue as guest (days 1–3 free)
            </Link>
          </div>
        </div>
      </div>

      <OtpVerificationModal
        isOpen={showOtpModal}
        email={email}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
}
