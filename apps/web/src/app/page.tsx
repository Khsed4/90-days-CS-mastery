'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth, AuthBarrierModal } from '@/features/auth';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { challengeService } from '@/services/challenge.service';
import { translations } from '@/lib/translations';
import { Challenge, ProgrammingLanguage } from '@shared/types';
import { PROGRAMMING_LANGUAGES, CS_CATEGORIES } from '@shared/constants';

function ChallengeItem({
  challenge,
  isCompleted,
  isLocked,
  isObserver,
  onToggle,
  onLockedClick,
}: {
  challenge: Challenge;
  isCompleted: boolean;
  isLocked: boolean;
  isObserver: boolean;
  onToggle: () => void;
  onLockedClick: () => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockedClick();
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-950/50 text-emerald-400 border-emerald-800/80';
      case 'medium':
        return 'bg-amber-950/50 text-amber-400 border-amber-800/80';
      case 'hard':
        return 'bg-rose-950/50 text-rose-400 border-rose-800/80';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <Link
      href={`/challenge/${challenge.id}`}
      onClick={handleClick}
      className={`group relative flex items-center justify-between p-3.5 rounded-lg border transition-all text-left ${
        isCompleted
          ? 'bg-blue-950/20 border-blue-800/60 hover:border-blue-700'
          : isLocked
          ? 'bg-zinc-900/40 border-zinc-800/60 opacity-75 hover:border-zinc-700'
          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        {isObserver ? (
          <div className="w-5 h-5 rounded-md bg-zinc-800/90 border border-zinc-700/80 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-400 shrink-0">
            {challenge.id}
          </div>
        ) : (
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer shrink-0"
          />
        )}
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Day {challenge.id}
            </span>
            {challenge.id <= 3 && !isObserver && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Free Trial
              </span>
            )}
            {isLocked && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
                <i className="fa-solid fa-lock text-[9px]"></i> Locked
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-zinc-200 group-hover:text-white truncate mt-0.5">
            {challenge.title}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getDifficultyBadge(
            challenge.difficulty
          )}`}
        >
          {challenge.difficulty}
        </span>
        <span className="text-[11px] text-zinc-400">{challenge.category}</span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const {
    user,
    isGuest,
    loading,
    progress,
    toggleDay,
    authBarrier,
    openAuthBarrier,
    closeAuthBarrier,
    selectedLanguage,
    allowedLanguages,
    setSelectedLanguage,
  } = useAuth();

  const isObserver = user?.role === 'ADMIN' || user?.role === 'ORGANIZATION';

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Compute allowed categories based on organization
  const allowedCategories = useMemo(() => {
    if (user?.organization?.allowedCategories && user.organization.allowedCategories.length > 0) {
      return user.organization.allowedCategories;
    }
    return CS_CATEGORIES.map((c) => c.name);
  }, [user]);

  const t = translations.en;

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const data = await challengeService.getCoreChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Error fetching challenges:', err);
    } finally {
      setFetching(false);
    }
  };

  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.id).includes(searchQuery);

      const matchesDiff =
        selectedDifficulty === 'ALL' ||
        c.difficulty.toUpperCase() === selectedDifficulty.toUpperCase();

      const matchesCategory =
        selectedCategory === 'ALL' || c.category === selectedCategory;

      const matchesOrgCategories =
        allowedCategories.length === 0 || allowedCategories.includes(c.category);

      return matchesSearch && matchesDiff && matchesCategory && matchesOrgCategories;
    });
  }, [challenges, searchQuery, selectedDifficulty, selectedCategory, allowedCategories]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-500"></i>
      </div>
    );
  }

  const phase1 = filteredChallenges.filter((c) => c.id >= 1 && c.id <= 30);
  const phase2 = filteredChallenges.filter((c) => c.id >= 31 && c.id <= 60);
  const phase3 = filteredChallenges.filter((c) => c.id >= 61 && c.id <= 90);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />

      {/* Guest Trial Banner */}
      {isGuest && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-blue-950/30 border border-blue-800/60 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-unlock-keyhole text-sm"></i>
              </div>
              <div>
                <p className="font-semibold text-white">
                  Guest Trial Active: Days 1 to 3 are unlocked
                </p>
                <p className="text-xs text-zinc-400">
                  Solve the first 3 challenges in guest mode. Sign up with email verification to sync all 90 days and submit community challenges.
                </p>
              </div>
            </div>
            <button
              onClick={() => openAuthBarrier()}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors whitespace-nowrap"
            >
              Sign Up & Cloud Sync
            </button>
          </div>
        </div>
      )}

      {/* Admin Inspection Banner */}
      {user?.role === 'ADMIN' && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/60 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-shield-halved text-sm"></i>
              </div>
              <div>
                <p className="font-semibold text-white">Admin Curriculum Inspection</p>
                <p className="text-xs text-zinc-400">
                  Viewing the 90-day mastery curriculum in moderator inspection mode. You can inspect all problem statements and reference solutions without altering learner progress.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-rose-200 bg-rose-900/60 hover:bg-rose-900 border border-rose-700 transition-colors whitespace-nowrap"
            >
              Admin Console →
            </Link>
          </div>
        </div>
      )}

      {/* Organization Preview Banner */}
      {user?.role === 'ORGANIZATION' && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-purple-950/30 border border-purple-800/60 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-building text-sm"></i>
              </div>
              <div>
                <p className="font-semibold text-white">Organization Curriculum Preview</p>
                <p className="text-xs text-zinc-400">
                  Explore all 90 days of challenges assigned to your team members in observer preview mode.
                </p>
              </div>
            </div>
            <Link
              href="/organization"
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-purple-200 bg-purple-900/60 hover:bg-purple-900 border border-purple-700 transition-colors whitespace-nowrap"
            >
              Team Dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8 flex-1">
        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-zinc-900">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              90-Day Computer Science Mastery Roadmap
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Systematic curriculum covering Core Algorithms, Data Structures, and System Concepts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500"></i>
              <input
                type="text"
                placeholder="Search challenges or day #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            {/* Category Filter Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs font-medium text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer max-w-[160px]"
            >
              <option value="ALL">All Categories</option>
              {allowedCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Programming Language Selector Bar */}
        <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-200">Selected Language:</span>
              <span className="text-xs text-blue-400 font-mono font-semibold uppercase">
                {selectedLanguage}
              </span>
              {user?.organization && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800 flex items-center gap-1">
                  <span>🏢</span>
                  <span>{user.organization.name} Curriculum Policy</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-zinc-500">
              Code editor &amp; starter solutions adapt to your chosen language
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {PROGRAMMING_LANGUAGES.map((lang) => {
              const isAllowed = allowedLanguages.includes(lang.id);
              const isActive = selectedLanguage === lang.id;

              if (!isAllowed) {
                return (
                  <button
                    key={lang.id}
                    disabled
                    title={`Locked by ${user?.organization?.name || 'organization'} policy`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-800/40 bg-zinc-950/40 text-zinc-600 cursor-not-allowed opacity-50 shrink-0"
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.name}</span>
                    <span className="text-[10px]">🔒</span>
                  </button>
                );
              }

              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm shadow-blue-500/20'
                      : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.name}</span>
                  {isActive && <span className="text-[10px] font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phase 1 */}
        {phase1.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                  {t.p1Label}
                </span>
                <h2 className="text-base font-semibold text-white">{t.p1Title}</h2>
                <span className="text-xs text-zinc-400 hidden sm:inline">— {t.p1Summary}</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Days 1 - 30</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {phase1.map((c) => (
                <ChallengeItem
                  key={c.id}
                  challenge={c}
                  isCompleted={!isObserver && progress.completedDays.includes(c.id)}
                  isLocked={!isObserver && isGuest && c.id > 3}
                  isObserver={isObserver}
                  onToggle={() => toggleDay(c.id)}
                  onLockedClick={() => openAuthBarrier(c.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Phase 2 */}
        {phase2.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                  {t.p2Label}
                </span>
                <h2 className="text-base font-semibold text-white">{t.p2Title}</h2>
                <span className="text-xs text-zinc-400 hidden sm:inline">— {t.p2Summary}</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Days 31 - 60</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {phase2.map((c) => (
                <ChallengeItem
                  key={c.id}
                  challenge={c}
                  isCompleted={!isObserver && progress.completedDays.includes(c.id)}
                  isLocked={!isObserver && isGuest}
                  isObserver={isObserver}
                  onToggle={() => toggleDay(c.id)}
                  onLockedClick={() => openAuthBarrier(c.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Phase 3 */}
        {phase3.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-950 text-purple-400 border border-purple-800">
                  {t.p3Label}
                </span>
                <h2 className="text-base font-semibold text-white">{t.p3Title}</h2>
                <span className="text-xs text-zinc-400 hidden sm:inline">— {t.p3Summary}</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">Days 61 - 90</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {phase3.map((c) => (
                <ChallengeItem
                  key={c.id}
                  challenge={c}
                  isCompleted={!isObserver && progress.completedDays.includes(c.id)}
                  isLocked={!isObserver && isGuest}
                  isObserver={isObserver}
                  onToggle={() => toggleDay(c.id)}
                  onLockedClick={() => openAuthBarrier(c.id)}
                />
              ))}
            </div>
          </section>
        )}

        {filteredChallenges.length === 0 && (
          <div className="p-12 text-center rounded-lg bg-zinc-900 border border-zinc-800">
            <i className="fa-solid fa-code text-2xl text-zinc-600 mb-2"></i>
            {challenges.length === 0 ? (
              <>
                <p className="text-sm font-medium text-zinc-300">No challenges in the database yet.</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Submit a new challenge to populate the roadmap or log in as Admin (<span className="text-zinc-400 font-mono">admin@example.com</span>) to manage curriculum.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <Link
                    href="/challenges/create"
                    className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                  >
                    Submit First Challenge
                  </Link>
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    Admin Login
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-400">No challenges match your search criteria.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDifficulty('ALL');
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300"
                >
                  Reset Filters
                </button>
              </>
            )}
          </div>
        )}
      </main>

      {/* Auth Barrier Modal */}
      <AuthBarrierModal
        isOpen={authBarrier.isOpen}
        dayId={authBarrier.dayId}
        onClose={closeAuthBarrier}
      />
    </div>
  );
}
