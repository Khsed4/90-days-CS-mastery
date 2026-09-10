'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../../services/auth.service';
import { progressService } from '../../services/progress.service';
import { useGuestProgress } from '../../hooks/useGuestProgress';
import { User, UserProgress, InterfaceLanguage } from '@shared/types';
import { AuthResponse } from '@shared/contracts';

interface AuthBarrierState {
  isOpen: boolean;
  dayId?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isGuest: boolean;
  progress: UserProgress;
  authBarrier: AuthBarrierState;
  openAuthBarrier: (dayId?: number) => void;
  closeAuthBarrier: () => void;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, name: string, inviteToken?: string) => Promise<AuthResponse>;
  registerOrganization: (organizationName: string, name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  toggleDay: (dayId: number) => Promise<boolean>;
  setInterfaceLang: (lang: InterfaceLanguage) => Promise<void>;
  handleAuthSuccess: (authData: AuthResponse) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authBarrier, setAuthBarrier] = useState<AuthBarrierState>({ isOpen: false });

  const {
    guestDays,
    guestStreak,
    guestLang,
    isLoaded: guestLoaded,
    toggleGuestDay,
    setLanguage: setGuestLang,
    clearGuestProgress,
  } = useGuestProgress();

  const [dbProgress, setDbProgress] = useState<UserProgress | null>(null);

  // Sync token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserData(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Compute active progress (DB progress if logged in, else guest progress)
  const activeProgress: UserProgress = user && dbProgress
    ? dbProgress
    : {
        userId: 'guest',
        completedDays: guestDays,
        streak: guestStreak,
        interfaceLang: guestLang,
      };

  // Enforce LTR for English
  useEffect(() => {
    if (typeof document !== 'undefined' && document.body) {
      document.body.dir = 'ltr';
    }
  }, []);

  const fetchUserData = async (activeToken?: string) => {
    try {
      const profile = await authService.getProfile();
      if (!profile.isEmailVerified) {
        logout();
        return;
      }
      setUser(profile);

      if (profile.role === 'USER') {
        const prog = await progressService.getProgress();
        setDbProgress(prog);
      } else {
        setDbProgress({
          userId: profile.id,
          completedDays: [],
          streak: 0,
          interfaceLang: 'en',
        });
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (authData: AuthResponse) => {
    localStorage.setItem('token', authData.accessToken);
    setToken(authData.accessToken);
    setUser(authData.user);

    if (authData.user.role === 'USER') {
      // Sync any guest progress to the user's account
      try {
        if (guestDays.length > 0) {
          const synced = await progressService.syncProgress({
            completedDays: guestDays,
            interfaceLang: guestLang,
          });
          setDbProgress(synced);
          clearGuestProgress();
        } else {
          const prog = await progressService.getProgress();
          setDbProgress(prog);
        }
      } catch (err) {
        console.error('Error syncing guest progress:', err);
      }
    } else {
      setDbProgress({
        userId: authData.user.id,
        completedDays: [],
        streak: 0,
        interfaceLang: 'en',
      });
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const res = await authService.login({ email, password });
    if (!res.requiresEmailVerification) {
      await handleAuthSuccess(res);
    }
    return res;
  };

  const register = async (email: string, password: string, name: string, inviteToken?: string): Promise<AuthResponse> => {
    const res = await authService.register({ email, password, name, inviteToken });
    if (!res.requiresEmailVerification) {
      await handleAuthSuccess(res);
    }
    return res;
  };

  const registerOrganization = async (
    organizationName: string,
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const res = await authService.registerOrganization({ organizationName, name, email, password });
    if (!res.requiresEmailVerification) {
      await handleAuthSuccess(res);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setDbProgress(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const openAuthBarrier = useCallback((dayId?: number) => {
    setAuthBarrier({ isOpen: true, dayId });
  }, []);

  const closeAuthBarrier = useCallback(() => {
    setAuthBarrier({ isOpen: false });
  }, []);

  const toggleDay = async (dayId: number): Promise<boolean> => {
    // Admins and Organizations are observers/moderators and cannot mark progress
    if (user && (user.role === 'ADMIN' || user.role === 'ORGANIZATION')) {
      return false;
    }

    // If learner is authenticated, update in DB
    if (token && user && user.role === 'USER') {
      try {
        const updated = await progressService.toggleDay(dayId);
        setDbProgress(updated);
        return true;
      } catch (err) {
        console.error('Error toggling day:', err);
        return false;
      }
    }

    // Guest Mode: Allow Days 1, 2, 3
    if (dayId <= 3) {
      toggleGuestDay(dayId);
      return true;
    }

    // Day 4+ requires login
    openAuthBarrier(dayId);
    return false;
  };

  const setInterfaceLang = async (lang: InterfaceLanguage) => {
    if (token && user) {
      try {
        const updated = await progressService.updateSettings(lang);
        setDbProgress(updated);
      } catch (err) {
        console.error('Error saving language:', err);
      }
    } else {
      setGuestLang(lang);
    }
  };

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      await fetchUserData(savedToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: loading || !guestLoaded,
        isGuest: !user,
        progress: activeProgress,
        authBarrier,
        openAuthBarrier,
        closeAuthBarrier,
        login,
        register,
        registerOrganization,
        logout,
        toggleDay,
        setInterfaceLang,
        handleAuthSuccess,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
