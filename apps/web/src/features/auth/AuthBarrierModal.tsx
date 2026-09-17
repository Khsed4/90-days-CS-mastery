'use client';

import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from './AuthContext';
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
          (tab === 'register' ? 'Registration failed' : 'Login failed. Invalid credentials.')
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
      <Modal isOpen={isOpen && !showOtpModal} onClose={onClose} maxWidth="max-w-md">
        <div className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Free Tier Limit</span>
            </div>

            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white tracking-tight">
              {dayId ? `Unlock Day ${dayId} & Sync Progress` : 'Save Your Progress in Cloud'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Create an account or sign in to continue past the 3 free trial challenges and keep your progress synced.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-zinc-100 dark:bg-[#0c0d10] p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                tab === 'register'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                tab === 'login'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
          </div>

          {error && (
            <div className="p-2.5 bg-[var(--badge-hard-bg)] border border-[var(--badge-hard-border)] rounded-md text-xs text-[var(--badge-hard-text)] text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'register' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Doe"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 mt-2 shadow-sm"
            >
              {loading
                ? 'Processing...'
                : tab === 'register'
                ? 'Sign Up & Cloud Sync'
                : 'Sign In & Cloud Sync'}
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
