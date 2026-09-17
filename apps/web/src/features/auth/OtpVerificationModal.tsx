'use client';

import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { OtpInput } from '../../components/ui/OtpInput';
import { useCountdown } from '../../hooks/useCountdown';
import { authService } from '../../services/auth.service';

interface OtpVerificationModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onSuccess: (authData: any) => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  email,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { secondsLeft, isActive, formattedTime, startCountdown } = useCountdown(60);

  const handleVerify = async (otpToVerify?: string) => {
    const finalCode = otpToVerify || code;
    if (finalCode.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await authService.verifyCode({ email, code: finalCode });
      onSuccess(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed. Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (isActive || resending) return;

    setError('');
    setResending(true);
    setResendSuccess(false);

    try {
      await authService.sendVerificationCode(email);
      setResendSuccess(true);
      startCountdown(60);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Verification" maxWidth="max-w-sm">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-sm mx-auto">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <div className="space-y-1">
          <h4 className="font-display text-base font-bold text-zinc-900 dark:text-white">Enter 6-Digit Passcode</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            We sent a verification code to <span className="font-semibold text-zinc-900 dark:text-zinc-200">{email}</span>
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-[var(--diff-hard-bg)] border border-rose-200 dark:border-rose-900/60 rounded-md text-xs text-[var(--diff-hard-text)] font-medium">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="p-2.5 bg-[var(--diff-easy-bg)] rounded-md text-xs text-[var(--diff-easy-text)] font-medium">
            New code sent.
          </div>
        )}

        <OtpInput
          value={code}
          onChange={setCode}
          onComplete={(otp) => handleVerify(otp)}
          disabled={loading}
        />

        <button
          onClick={() => handleVerify()}
          disabled={loading || code.length !== 6}
          className="w-full py-2 px-4 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div className="pt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Didn't receive the code?{' '}
          {isActive ? (
            <span className="font-mono text-zinc-700 dark:text-zinc-300">Resend in {formattedTime}</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-zinc-900 dark:text-zinc-100 font-medium underline underline-offset-2 hover:opacity-80"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
