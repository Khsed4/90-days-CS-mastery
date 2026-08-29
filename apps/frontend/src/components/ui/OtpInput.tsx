'use client';

import React, { useRef, useState, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));

  useEffect(() => {
    const arr = value.split('').slice(0, length);
    const padded = [...arr, ...Array(length - arr.length).fill('')];
    setDigits(padded);
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;
    const cleanVal = val.replace(/\D/g, '');
    const char = cleanVal.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    const newOtp = newDigits.join('');
    onChange(newOtp);

    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.length === length && !newDigits.includes('') && onComplete) {
      onComplete(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (disabled) return;
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < length; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setDigits(newDigits);

    const newOtp = newDigits.join('');
    onChange(newOtp);

    const nextIndex = Math.min(pasteData.length, length - 1);
    inputsRef.current[nextIndex]?.focus();

    if (newOtp.length === length && onComplete) {
      onComplete(newOtp);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        justifyContent: 'center',
        margin: '1.25rem 0',
      }}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[idx] || ''}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          style={{
            width: '46px',
            height: '56px',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'rgba(15, 23, 42, 0.6)',
            border: digits[idx]
              ? '2px solid var(--color-primary, #6366f1)'
              : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            color: '#38bdf8',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: digits[idx] ? '0 0 15px rgba(99, 102, 241, 0.3)' : 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary, #6366f1)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(99, 102, 241, 0.3)';
          }}
          onBlur={(e) => {
            if (!digits[idx]) {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        />
      ))}
    </div>
  );
};
