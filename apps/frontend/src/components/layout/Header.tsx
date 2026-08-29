'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { translations } from '../../lib/translations';

interface HeaderProps {
  customTitle?: string;
  showBackToHub?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ customTitle, showBackToHub }) => {
  const {
    user,
    isGuest,
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
    <header className="app-header">
      {/* Left: Logo & Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="logo-container">
          {showBackToHub ? (
            <Link href="/" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              <i className="fa-solid fa-arrow-left"></i> {t.returnHub}
            </Link>
          ) : (
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <i className="fa-solid fa-circle-nodes" style={{ fontSize: '1.5rem', color: 'var(--color-primary, #6366f1)' }}></i>
              <div className="logo-text">{customTitle || t.logoText}</div>
            </Link>
          )}
        </div>

        {/* Main Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link
            href="/"
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: isActive('/') ? '#ffffff' : '#94a3b8',
              background: isActive('/') ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: `1px solid ${isActive('/') ? 'rgba(99, 102, 241, 0.4)' : 'transparent'}`,
              transition: 'all 0.2s ease',
            }}
          >
            🗺️ 90-Day Roadmap
          </Link>

          <Link
            href="/bonus-challenges"
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: isActive('/bonus-challenges') ? '#38bdf8' : '#94a3b8',
              background: isActive('/bonus-challenges') ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              border: `1px solid ${isActive('/bonus-challenges') ? 'rgba(6, 182, 212, 0.4)' : 'transparent'}`,
              transition: 'all 0.2s ease',
            }}
          >
            ⭐ Bonus Challenges
          </Link>

          <Link
            href="/challenges/create"
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: isActive('/challenges/create') ? '#4ade80' : '#94a3b8',
              background: isActive('/challenges/create') ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
              border: `1px solid ${isActive('/challenges/create') ? 'rgba(34, 197, 94, 0.4)' : 'transparent'}`,
              transition: 'all 0.2s ease',
            }}
          >
            ➕ Submit Challenge
          </Link>

          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: isActive('/admin') ? '#f87171' : '#fb7185',
                background: isActive('/admin') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${isActive('/admin') ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.2)'}`,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              🛡️ Admin Panel
            </Link>
          )}
        </nav>
      </div>

      {/* Right: Stats, Lang & Profile */}
      <div className="header-stats-controls">
        <select
          className="lang-dropdown"
          value={progress.interfaceLang || 'en'}
          onChange={(e) => setInterfaceLang(e.target.value as any)}
        >
          <option value="en">English</option>
          <option value="fa">فارسی</option>
          <option value="ps">پښتو</option>
        </select>

        <div className="header-stats">
          <div className="stat-badge streak">
            <i className="fa-solid fa-fire"></i>
            <span>{t.streak}:</span> <strong>{progress.streak}</strong>
          </div>
          <div className="stat-badge">
            <i className="fa-solid fa-circle-check"></i>
            <span>{t.progress}:</span> <strong>{completedCount}</strong>/90 ({pct}%)
          </div>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <i className="fa-solid fa-user" style={{ color: '#818cf8', fontSize: '0.85rem' }}></i>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc' }}>
                {user.name}
              </span>
              {user.role === 'ADMIN' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '800',
                  }}
                >
                  ADMIN
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {t.logout}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => openAuthBarrier()}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              <i className="fa-solid fa-cloud-arrow-up"></i> Save Progress
            </button>
            <Link
              href="/login"
              className="btn btn-outline"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              {t.login}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
