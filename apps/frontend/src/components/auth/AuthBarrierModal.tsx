'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { OtpVerificationModal } from './OtpVerificationModal';

interface AuthBarrierModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayId?: number;
  onSuccess?: () => void;
}

export const AuthBarrierModal: React.FC<AuthBarrierModalProps> = ({
  isOpen,
  onClose,
  dayId,
  onSuccess,
}) => {
  const { login, register, handleAuthSuccess } = useAuth();

  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'register') {
        const res = await register(email, password, name);
        if (res.requiresEmailVerification) {
          setPendingEmail(email);
          setShowOtpModal(true);
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
      } else {
        const res = await login(email, password);
        if (res.requiresEmailVerification) {
          setPendingEmail(email);
          setShowOtpModal(true);
        } else {
          onClose();
          if (onSuccess) onSuccess();
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (tab === 'register' ? 'Registration failed' : 'Login failed. Invalid credentials.'),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = (authData: any) => {
    handleAuthSuccess(authData);
    setShowOtpModal(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Modal isOpen={isOpen && !showOtpModal} onClose={onClose} maxWidth="460px">
        <div>
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '999px',
                color: '#818cf8',
                fontSize: '0.8rem',
                fontWeight: '700',
                marginBottom: '0.75rem',
              }}
            >
              <span>✨</span> Trial Mode Completed
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>
              {dayId ? `Unlock Day ${dayId} & Save Progress` : 'Save Your Progress in Cloud'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.5' }}>
              You've tried out the initial 3 challenges! To continue your 90-day algorithmic journey and
              keep your streak synced across devices, please sign in.
            </p>
          </div>

          {/* Tab Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: '8px',
                background: tab === 'register' ? 'var(--color-primary, #6366f1)' : 'transparent',
                color: tab === 'register' ? '#ffffff' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Create Free Account
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              style={{
                flex: 1,
                padding: '0.6rem',
                border: 'none',
                borderRadius: '8px',
                background: tab === 'login' ? 'var(--color-primary, #6366f1)' : 'transparent',
                color: tab === 'login' ? '#ffffff' : '#94a3b8',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Log In
            </button>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tab === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Doe"
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '0.7rem 0.9rem',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.7rem 0.9rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.7rem 0.9rem',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.8rem',
                marginTop: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '700',
              }}
            >
              {loading
                ? 'Processing...'
                : tab === 'register'
                ? 'Sign Up & Sync Progress'
                : 'Log In & Sync Progress'}
            </button>
          </form>
        </div>
      </Modal>

      <OtpVerificationModal
        isOpen={showOtpModal}
        email={pendingEmail}
        onClose={() => setShowOtpModal(false)}
        onSuccess={handleOtpVerified}
      />
    </>
  );
};
