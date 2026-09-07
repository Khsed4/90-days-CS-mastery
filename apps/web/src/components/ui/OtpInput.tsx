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
    <div className="flex gap-2 justify-center my-4" onPaste={handlePaste}>
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
          className={`w-11 h-13 text-center text-lg font-bold rounded-md bg-zinc-950 border text-white focus:outline-none transition-colors ${
            digits[idx]
              ? 'border-blue-500 bg-blue-950/20'
              : 'border-zinc-800 focus:border-zinc-600'
          }`}
        />
      ))}
    </div>
  );
};
