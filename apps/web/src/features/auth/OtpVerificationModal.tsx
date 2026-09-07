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
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Email" maxWidth="max-w-sm">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center text-lg mx-auto">
          <i className="fa-regular fa-envelope"></i>
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">Enter 6-Digit Passcode</h4>
          <p className="text-xs text-zinc-400">
            We sent a verification code to <span className="font-semibold text-zinc-200">{email}</span>
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-950/50 border border-rose-800 rounded text-xs text-rose-300">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="p-2.5 bg-emerald-950/50 border border-emerald-800 rounded text-xs text-emerald-300">
            New code sent successfully!
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
          className="w-full py-2 px-4 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div className="pt-2 text-xs text-zinc-400">
          Didn't receive the code?{' '}
          {isActive ? (
            <span className="text-zinc-500 font-mono">Resend in {formattedTime}</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-400 hover:text-blue-300 font-medium underline"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
