'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { OtpInput } from '../ui/OtpInput';
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
    <Modal isOpen={isOpen} onClose={onClose} title="Verify Your Email" maxWidth="440px">
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            margin: '0 auto 1rem auto',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          }}
        >
          ✉️
        </div>

        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#ffffff', fontWeight: '700' }}>
          Check Your Inbox
        </h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.5' }}>
          We sent a 6-digit verification code to:
          <br />
          <strong style={{ color: '#38bdf8' }}>{email}</strong>
        </p>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.65rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginTop: '1rem',
            }}
          >
            {error}
          </div>
        )}

        {resendSuccess && (
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              padding: '0.65rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginTop: '1rem',
            }}
          >
            New verification code sent!
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
          className="btn btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '0.85rem',
            fontSize: '0.95rem',
            fontWeight: '700',
            opacity: loading || code.length !== 6 ? 0.6 : 1,
            cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Verifying Code...' : 'Verify & Continue'}
        </button>

        <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Didn't receive the code?{' '}
          {isActive ? (
            <span style={{ color: '#64748b' }}>Resend in {formattedTime}</span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                cursor: 'pointer',
                fontWeight: '600',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
