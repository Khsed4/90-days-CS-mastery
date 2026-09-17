'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { translations } from '../../lib/translations';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  customTitle?: string;
  showBackToHub?: boolean;
}

/* ─── Inline SVG icons (no FA dependency) ─── */
const Icons = {
  Terminal: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
    </svg>
  ),
  Menu: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
    </svg>
  ),
  Close: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
    </svg>
  ),
};

/* ─── Shared nav link ─── */
function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
        active
          ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold'
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
      }`}
    >
      {children}
    </Link>
  );
}

/* ─── Brand mark ─── */
function Brand({ href, label }: { href: string; label?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 group shrink-0">
      <div className="w-7 h-7 rounded-md bg-[var(--text-primary)] text-[var(--bg-canvas)] flex items-center justify-center transition-opacity group-hover:opacity-80">
        <Icons.Terminal />
      </div>
      <span className="font-semibold text-sm tracking-tight text-[var(--text-primary)] hidden sm:block">
        {label || 'CS Mastery'}
      </span>
    </Link>
  );
}

/* ─── Back button ─── */
function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
    >
      <Icons.ChevronLeft />
      {label}
    </Link>
  );
}

/* ─── Role badge ─── */
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    ORGANIZATION: 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-border)]',
  };
  return (
    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border ${styles[role] ?? 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-subtle)]'}`}>
      {role === 'ORGANIZATION' ? 'ORG' : role}
    </span>
  );
}

/* ─── Unified Header ─── */
export function Header({ customTitle, showBackToHub }: HeaderProps) {
  const { user, progress, logout, openAuthBarrier } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = translations.en;

  const role = user?.role;
  const isAdmin = role === 'ADMIN';
  const isOrg = role === 'ORGANIZATION';
  const isLearner = !isAdmin && !isOrg;

  const completedCount = progress?.completedDays?.length ?? 0;
  const pct = Math.round((completedCount / 90) * 100);
  const streak = progress?.streak ?? 0;

  const active = (path: string) => pathname === path;

  /* Determine nav links per role */
  const navLinks = isAdmin
    ? [
        { href: '/admin', label: 'Console' },
        { href: '/', label: 'Curriculum' },
        { href: '/bonus-challenges', label: 'Bonus' },
      ]
    : isOrg
    ? [
        { href: '/organization', label: 'Team' },
        { href: '/', label: 'Curriculum' },
        { href: '/bonus-challenges', label: 'Bonus' },
      ]
    : [
        { href: '/', label: 'Roadmap' },
        { href: '/bonus-challenges', label: 'Bonus' },
        { href: '/challenges/create', label: 'Submit' },
      ];

  /* Determine back button */
  const backHref = isAdmin ? '/admin' : isOrg ? '/organization' : '/';
  const backLabel = isAdmin ? 'Back to console' : isOrg ? 'Back to team' : t.returnHub;

  /* Determine header border accent */
  const borderClass = isAdmin
    ? 'border-rose-200 dark:border-rose-900/40'
    : isOrg
    ? 'border-[var(--accent-border)]'
    : 'border-[var(--border-subtle)]';

  return (
    <header className={`sticky top-0 z-40 w-full border-b ${borderClass} bg-[var(--bg-surface)]/95 backdrop-blur-sm transition-colors`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">

          {/* ── Left: brand / back ── */}
          <div className="flex items-center gap-4">
            {showBackToHub ? (
              <BackButton href={backHref} label={backLabel} />
            ) : (
              <Brand
                href={isAdmin ? '/admin' : isOrg ? '/organization' : '/'}
                label={customTitle || (isOrg ? (user?.organization?.name || 'CS Mastery') : 'CS Mastery')}
              />
            )}

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map(({ href, label }) => (
                <NavLink key={href} href={href} active={active(href)}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* ── Right: stats, user, actions ── */}
          <div className="flex items-center gap-2">
            {/* Learner progress (only for learner role, on desktop) */}
            {isLearner && user && (
              <div className="hidden sm:flex items-center gap-3 mr-1">
                {streak > 0 && (
                  <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums" title={`${streak}-day streak`}>
                    {streak}d
                  </span>
                )}
                <div className="flex items-center gap-1.5" title={`${completedCount}/90 completed`}>
                  <div className="h-1 w-16 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-[var(--text-faint)] tabular-nums">{pct}%</span>
                </div>
              </div>
            )}

            {/* Admin quick action */}
            {isAdmin && (
              <Link
                href="/challenges/create"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 transition-colors"
              >
                + New challenge
              </Link>
            )}

            {/* Org quick action */}
            {isOrg && (
              <Link
                href="/organization#invites"
                className="hidden sm:inline-flex items-center text-xs font-medium text-[var(--accent)] hover:opacity-75 transition-opacity"
              >
                Invite members
              </Link>
            )}

            <ThemeToggle />

            {/* User identity */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs">
                  <span className="font-medium text-[var(--text-primary)] max-w-[110px] truncate">{user.name}</span>
                  <RoleBadge role={role!} />
                </div>
                <button
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-subtle)] transition-colors"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthBarrier()}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-[var(--bg-canvas)] bg-[var(--text-primary)] hover:opacity-80 transition-opacity active:scale-95"
                >
                  Save progress
                </button>
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  {t.login}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              {mobileOpen ? <Icons.Close /> : <Icons.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden pt-2 pb-1 border-t border-[var(--border-subtle)] mt-2 flex flex-col gap-0.5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                  active(href)
                    ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
