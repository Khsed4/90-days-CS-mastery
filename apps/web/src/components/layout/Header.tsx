'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { translations } from '../../lib/translations';

interface HeaderProps {
  customTitle?: string;
  showBackToHub?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ customTitle, showBackToHub }) => {
  const {
    user,
    progress,
    logout,
    setInterfaceLang,
    openAuthBarrier,
  } = useAuth();
  const pathname = usePathname();

  const t = translations[progress.interfaceLang || 'en'] || translations.en;
  const completedCount = progress.completedDays.length;
  const pct = Math.round((completedCount / 90) * 100);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-6">
          {showBackToHub ? (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>{t.returnHub}</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2.5 text-zinc-100 hover:text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                <i className="fa-solid fa-code"></i>
              </div>
              <span className="font-semibold text-base tracking-tight text-white">
                {customTitle || t.logoText}
              </span>
            </Link>
          )}

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-zinc-900 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              Roadmap
            </Link>

            <Link
              href="/bonus-challenges"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/bonus-challenges')
                  ? 'bg-zinc-900 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              Bonus Challenges
            </Link>

            <Link
              href="/challenges/create"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/challenges/create')
                  ? 'bg-zinc-900 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              Submit Challenge
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                    : 'text-rose-400 hover:bg-rose-950/30'
                }`}
              >
                <i className="fa-solid fa-shield-halved text-xs"></i>
                <span>Admin</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Stats, Language & Profile */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <select
            className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
            value={progress.interfaceLang || 'en'}
            onChange={(e) => setInterfaceLang(e.target.value as any)}
          >
            <option value="en">EN</option>
            <option value="fa">فارسی</option>
            <option value="ps">پښتو</option>
          </select>

          {/* Stats Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-amber-400">
              <i className="fa-solid fa-fire text-amber-500"></i>
              <span>{progress.streak}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300">
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span>
                {completedCount}/90 <span className="text-zinc-500">({pct}%)</span>
              </span>
            </div>
          </div>

          {/* User Auth Info */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
                <i className="fa-regular fa-user text-zinc-400"></i>
                <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                {user.role === 'ADMIN' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                    ADMIN
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthBarrier()}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
              >
                Save Progress
              </button>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                {t.login}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
