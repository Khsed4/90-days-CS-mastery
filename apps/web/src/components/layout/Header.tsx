'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { translations } from '../../lib/translations';

interface HeaderProps {
  customTitle?: string;
  showBackToHub?: boolean;
}

/**
 * 🛡️ Admin Header
 * Tailored for Platform Administrators: Focuses on moderation, challenge studio, user directory, and platform metrics.
 */
function AdminHeader({ customTitle, showBackToHub }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-950/60 bg-zinc-950/95 backdrop-blur px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-6">
          {showBackToHub ? (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>Back to Admin Console</span>
            </Link>
          ) : (
            <Link href="/admin" className="flex items-center gap-2.5 text-zinc-100 hover:text-white group">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-900/30 group-hover:bg-rose-500 transition-colors">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white">
                    {customTitle || 'CS Mastery'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-rose-950 text-rose-400 border border-rose-800 uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">System Governance</span>
              </div>
            </Link>
          )}

          {/* Admin Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/admin')
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-800 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <i className="fa-solid fa-sliders text-xs"></i>
              <span>Console & Directory</span>
            </Link>

            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/')
                  ? 'bg-zinc-900 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <i className="fa-solid fa-book-open text-xs"></i>
              <span>Curriculum View</span>
            </Link>

            <Link
              href="/bonus-challenges"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/bonus-challenges')
                  ? 'bg-zinc-900 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <i className="fa-solid fa-layer-group text-xs"></i>
              <span>Bonus Challenges</span>
            </Link>
          </nav>
        </div>

        {/* Right: Quick Actions & Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/challenges/create"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 transition-colors"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>New Challenge</span>
          </Link>

          {/* Admin Identity Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-semibold text-white max-w-[140px] truncate">{user?.name}</span>
            <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
              SUPERADMIN
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            Logout
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded text-zinc-400 hover:text-white"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-base`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-zinc-900 mt-3 flex flex-col gap-1">
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-rose-300 bg-rose-950/40"
          >
            Console & Directory
          </Link>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
          >
            Curriculum View
          </Link>
          <Link
            href="/bonus-challenges"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
          >
            Bonus Challenges
          </Link>
          <Link
            href="/challenges/create"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-rose-400 hover:bg-zinc-900"
          >
            + New Challenge
          </Link>
        </div>
      )}
    </header>
  );
}

/**
 * 🏢 Organization Header
 * Tailored for Organizations & Team Leads: Focuses on cohort management, invite generation, and team progress tracking.
 */
function OrganizationHeader({ customTitle, showBackToHub }: HeaderProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const orgName = user?.organization?.name || 'Organization';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/60 bg-zinc-950/95 backdrop-blur px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-6">
          {showBackToHub ? (
            <Link
              href="/organization"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>Back to Org Hub</span>
            </Link>
          ) : (
            <Link href="/organization" className="flex items-center gap-2.5 text-zinc-100 hover:text-white group">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-900/30 group-hover:bg-purple-500 transition-colors">
                <i className="fa-solid fa-building"></i>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-white">
                    {customTitle || orgName}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 uppercase tracking-wider">
                    Portal
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">Team & Cohort Management</span>
              </div>
            </Link>
          )}

          {/* Org Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/organization"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/organization')
                  ? 'bg-purple-950/80 text-purple-200 border border-purple-800 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <i className="fa-solid fa-users text-xs"></i>
              <span>Team Dashboard</span>
            </Link>

            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/')
                  ? 'bg-zinc-900 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <i className="fa-solid fa-compass text-xs"></i>
              <span>Curriculum Explorer</span>
            </Link>

            <Link
              href="/bonus-challenges"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/bonus-challenges')
                  ? 'bg-zinc-900 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <i className="fa-solid fa-puzzle-piece text-xs"></i>
              <span>Bonus Challenges</span>
            </Link>
          </nav>
        </div>

        {/* Right: Quick Org Actions & Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/organization#invites"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/80 transition-colors"
          >
            <i className="fa-solid fa-link text-xs"></i>
            <span>Invite Members</span>
          </Link>

          {/* Org Manager Identity Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
            <i className="fa-solid fa-user-tie text-purple-400"></i>
            <span className="font-semibold text-white max-w-[130px] truncate">{user?.name}</span>
            <span className="text-[10px] text-purple-300 font-semibold bg-purple-950 px-1.5 py-0.5 rounded border border-purple-800">
              ORG ADMIN
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            Logout
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded text-zinc-400 hover:text-white"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-base`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-zinc-900 mt-3 flex flex-col gap-1">
          <Link
            href="/organization"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-purple-300 bg-purple-950/40"
          >
            Team Dashboard
          </Link>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
          >
            Curriculum Explorer
          </Link>
          <Link
            href="/bonus-challenges"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
          >
            Bonus Challenges
          </Link>
        </div>
      )}
    </header>
  );
}

/**
 * 👤 Personal Learner & Guest Header
 * Tailored for Active Coders: Focuses on 90-day progress, daily streaks, code submissions, and personal achievements.
 */
function LearnerHeader({ customTitle, showBackToHub }: HeaderProps) {
  const {
    user,
    progress,
    logout,
    openAuthBarrier,
  } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations.en;
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
            <Link href="/" className="flex items-center gap-2.5 text-zinc-100 hover:text-white group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-900/30 group-hover:bg-blue-500 transition-colors">
                <i className="fa-solid fa-code"></i>
              </div>
              <span className="font-semibold text-base tracking-tight text-white">
                {customTitle || t.logoText}
              </span>
            </Link>
          )}

          {/* Learner Nav Links */}
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
          </nav>
        </div>

        {/* Right: Streak, Progress & Profile */}
        <div className="flex items-center gap-3">
          {/* Gamified Stats Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-amber-400"
              title={`${progress.streak} Day Active Streak`}
            >
              <i className="fa-solid fa-fire text-amber-500"></i>
              <span>{progress.streak}d</span>
            </div>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300"
              title={`${completedCount} of 90 Days Completed`}
            >
              <i className="fa-solid fa-check text-emerald-500"></i>
              <span>
                {completedCount}/90 <span className="text-zinc-500">({pct}%)</span>
              </span>
            </div>
          </div>

          {/* User Auth or Guest Controls */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200">
                <i className="fa-regular fa-user text-zinc-400"></i>
                <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                {user.organization && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800 truncate max-w-[90px]"
                    title={`Member of ${user.organization.name}`}
                  >
                    🏢 {user.organization.name}
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded text-zinc-400 hover:text-white"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-base`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-zinc-900 mt-3 flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-white bg-zinc-900"
          >
            Roadmap
          </Link>
          <Link
            href="/bonus-challenges"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
          >
            Bonus Challenges
          </Link>
          <Link
            href="/challenges/create"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-xs font-semibold text-zinc-300 hover:bg-zinc-900"
          >
            Submit Challenge
          </Link>
        </div>
      )}
    </header>
  );
}

/**
 * 🎯 Unified Header Router Component
 * Intelligently serves the specialized header matching the authenticated user's exact role and privilege tier.
 */
export const Header: React.FC<HeaderProps> = (props) => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminHeader {...props} />;
  }

  if (user?.role === 'ORGANIZATION') {
    return <OrganizationHeader {...props} />;
  }

  return <LearnerHeader {...props} />;
};

export default Header;
