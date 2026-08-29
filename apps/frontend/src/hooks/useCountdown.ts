import { useState, useEffect, useCallback } from 'react';

export function useCountdown(initialSeconds: number = 60) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const startCountdown = useCallback((duration: number = initialSeconds) => {
    setSecondsLeft(duration);
  }, [initialSeconds]);

  const formattedTime = `${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60)
    .toString()
    .padStart(2, '0')}`;

  return {
    secondsLeft,
    isActive: secondsLeft > 0,
    formattedTime,
    startCountdown,
  };
}
