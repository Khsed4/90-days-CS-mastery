'use client';

import { useState, useEffect, useCallback } from 'react';
import { InterfaceLanguage } from '@shared/types';

const GUEST_DAYS_KEY = 'guest_completed_days';
const GUEST_LANG_KEY = 'guest_interface_lang';

export function useGuestProgress() {
  const [guestDays, setGuestDays] = useState<number[]>([]);
  const [guestLang, setGuestLang] = useState<InterfaceLanguage>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedDays = localStorage.getItem(GUEST_DAYS_KEY);
      const savedLang = localStorage.getItem(GUEST_LANG_KEY) as InterfaceLanguage;

      if (savedDays) {
        const parsed = JSON.parse(savedDays);
        if (Array.isArray(parsed)) {
          setGuestDays(parsed);
        }
      }
      if (savedLang) {
        setGuestLang(savedLang);
      }
    } catch (e) {
      console.error('Error reading guest progress from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveDays = useCallback((days: number[]) => {
    setGuestDays(days);
    try {
      localStorage.setItem(GUEST_DAYS_KEY, JSON.stringify(days));
    } catch (e) {
      console.error('Error saving guest progress:', e);
    }
  }, []);

  const toggleGuestDay = useCallback(
    (dayId: number): { allowed: boolean; days: number[] } => {
      // Days 1, 2, 3 are allowed in Guest Trial Mode
      if (dayId > 3) {
        return { allowed: false, days: guestDays };
      }

      let updated: number[];
      if (guestDays.includes(dayId)) {
        updated = guestDays.filter((d) => d !== dayId);
      } else {
        updated = [...guestDays, dayId].sort((a, b) => a - b);
      }

      saveDays(updated);
      return { allowed: true, days: updated };
    },
    [guestDays, saveDays],
  );

  const setLanguage = useCallback((lang: InterfaceLanguage) => {
    setGuestLang(lang);
    try {
      localStorage.setItem(GUEST_LANG_KEY, lang);
    } catch (e) {
      console.error('Error saving guest language:', e);
    }
  }, []);

  const clearGuestProgress = useCallback(() => {
    setGuestDays([]);
    try {
      localStorage.removeItem(GUEST_DAYS_KEY);
    } catch (e) {
      console.error('Error clearing guest progress:', e);
    }
  }, []);

  // Calculate streak
  let streak = 0;
  const daySet = new Set(guestDays);
  for (let i = 1; i <= 90; i++) {
    if (daySet.has(i)) streak++;
    else break;
  }

  return {
    guestDays,
    guestStreak: streak,
    guestLang,
    isLoaded,
    toggleGuestDay,
    setLanguage,
    clearGuestProgress,
  };
}
