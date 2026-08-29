'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translations } from '../../lib/translations';
import { OtpVerificationModal } from '../../components/auth/OtpVerificationModal';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundImage: `radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.22), transparent 45%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.2), transparent 45%), url('/images/cosmic-mesh-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {/* Dark Ambient Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(9, 13, 22, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(135deg, rgba(20, 29, 50, 0.85) 0%, rgba(10, 16, 32, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '2.75rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(6, 182, 212, 0.25)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 1rem auto',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
            }}
          >
            <i className="fa-solid fa-user-astronaut" style={{ fontSize: '1.75rem', color: '#38bdf8' }}></i>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', margin: 0, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            {t.register}
          </h2>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Create an account to unlock all 90 days & sync cloud progress
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--text-secondary, #94a3b8)',
                marginBottom: '0.4rem',
              }}
            >
              {t.name}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--text-secondary, #94a3b8)',
                marginBottom: '0.4rem',
              }}
            >
              {t.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: 'var(--text-secondary, #94a3b8)',
                marginBottom: '0.4rem',
              }}
            >
              {t.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              justifyContent: 'center',
              marginTop: '0.5rem',
              padding: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            {submitting ? 'Creating account...' : t.register}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Link
            href="/login"
            style={{ color: 'var(--color-secondary, #38bdf8)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}
          >
            {t.haveAccount}
          </Link>
          <Link
            href="/"
            style={{ color: '#94a3b8', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            ← Continue as Guest (Days 1–3 Free)
          </Link>
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
