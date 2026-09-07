'use client';

import React, { useState } from 'react';
import { useAuth, OtpVerificationModal } from '@/features/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translations } from '@/lib/translations';

export default function RegisterPage() {
  const { register, progress, handleAuthSuccess } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);

  const t = translations[progress.interfaceLang || 'en'] || translations.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await register(email, password, name);
      if (res.requiresEmailVerification) {
        setShowOtpModal(true);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSuccess = (authData: any) => {
    handleAuthSuccess(authData);
    setShowOtpModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-lg mb-1">
            <i className="fa-solid fa-code"></i>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-xs text-zinc-400">
            Unlock all 90 days, bonus challenges, and cloud sync
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sm:p-7 shadow-sm space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-md text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                {t.name}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                {t.email}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                {t.password}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-4 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Creating account...' : t.register}
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-800/80 text-center space-y-2">
            <Link
              href="/login"
              className="block text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              {t.haveAccount}
            </Link>
            <Link
              href="/"
              className="block text-xs text-zinc-500 hover:text-zinc-400"
            >
              ← Continue as Guest (Days 1–3 Free)
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
