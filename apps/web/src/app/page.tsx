'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth, AuthBarrierModal } from '@/features/auth';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { challengeService } from '@/services/challenge.service';
import { translations } from '@/lib/translations';
import { Challenge, ProgrammingLanguage } from '@shared/types';
import { PROGRAMMING_LANGUAGES, CS_CATEGORIES } from '@shared/constants';

/* ─── Difficulty label helper ─── */
function diffStyle(diff: string) {
  switch (diff.toLowerCase()) {
    case 'easy':   return 'text-[var(--diff-easy-text)] bg-[var(--diff-easy-bg)]';
    case 'medium': return 'text-[var(--diff-med-text)]  bg-[var(--diff-med-bg)]';
    case 'hard':   return 'text-[var(--diff-hard-text)] bg-[var(--diff-hard-bg)]';
    default:       return 'text-[var(--text-muted)] bg-[var(--bg-subtle)]';
  }
}

/* ─── Individual challenge row ─── */
function ChallengeRow({
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
    if (isLocked) { e.preventDefault(); onLockedClick(); }
  };

  return (
    <Link
      href={`/challenge/${challenge.id}`}
      onClick={handleClick}
      className={`group flex items-center gap-4 px-4 py-3 border-b border-[var(--border-subtle)] transition-colors last:border-b-0 ${
        isLocked
          ? 'opacity-50 cursor-pointer hover:opacity-60'
          : isCompleted
          ? 'bg-[var(--bg-subtle)]'
          : 'hover:bg-[var(--bg-hover)]'
      }`}
    >
      {/* Checkbox / Day number */}
      <div className="w-9 shrink-0 flex items-center justify-center">
        {isObserver ? (
          <span className="font-mono text-[11px] text-[var(--text-faint)] tabular-nums w-6 text-center">
            {String(challenge.id).padStart(2, '0')}
          </span>
        ) : (
          <input
            type="checkbox"
            checked={isCompleted}
            disabled={isLocked}
            onChange={(e) => { e.stopPropagation(); onToggle(); }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded-sm border border-[var(--border-mid)] bg-[var(--bg-surface)] text-[var(--accent)] accent-[var(--accent)] cursor-pointer shrink-0 focus:ring-0 focus:outline-none"
          />
        )}
      </div>

      {/* Day label (left column) */}
      <span className="font-mono text-[11px] text-[var(--text-faint)] tabular-nums w-10 shrink-0">
        Day {challenge.id}
      </span>

      {/* Title */}
      <span className={`flex-1 text-sm font-medium truncate transition-colors ${
        isCompleted
          ? 'line-through text-[var(--text-muted)]'
          : 'text-[var(--text-primary)] group-hover:text-[var(--text-primary)]'
      }`}>
        {challenge.title}
      </span>

      {/* Category */}
      <span className="hidden md:block text-[11px] text-[var(--text-faint)] truncate max-w-[130px] shrink-0">
        {challenge.category}
      </span>

      {/* Difficulty */}
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize shrink-0 ${diffStyle(challenge.difficulty)}`}>
        {challenge.difficulty}
      </span>

      {/* Lock or free trial marker */}
      {isLocked && (
        <span className="text-[10px] text-[var(--text-faint)] shrink-0">Locked</span>
      )}
      {challenge.id <= 3 && !isObserver && !isLocked && (
        <span className="text-[10px] text-[var(--diff-easy-text)] bg-[var(--diff-easy-bg)] px-1.5 py-0.5 rounded shrink-0">Free</span>
      )}
    </Link>
  );
}

/* ─── Phase section (no eyebrow pill, just a flat divider line) ─── */
function PhaseSection({
  title,
  range,
  challenges,
  progress,
  isGuest,
  isObserver,
  toggleDay,
  openAuthBarrier,
}: {
  title: string;
  range: string;
  challenges: Challenge[];
  progress: { completedDays: number[] };
  isGuest: boolean;
  isObserver: boolean;
  toggleDay: (id: number) => void;
  openAuthBarrier: (id?: number) => void;
}) {
  const completed = challenges.filter(c => progress.completedDays.includes(c.id)).length;
  const pct = challenges.length > 0 ? Math.round((completed / challenges.length) * 100) : 0;

  return (
    <section>
      {/* Phase header — no eyebrow badge */}
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">{title}</h2>
          <span className="text-xs text-[var(--text-faint)]">{range}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-1 w-24 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-[var(--text-faint)] tabular-nums">{completed}/{challenges.length}</span>
        </div>
      </div>

      {/* Challenge list — clean row layout, NOT a 3-col grid */}
      <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
        {challenges.map((challenge) => (
          <ChallengeRow
            key={challenge.id}
            challenge={challenge}
            isCompleted={progress.completedDays.includes(challenge.id)}
            isLocked={isGuest && challenge.id > 3}
            isObserver={isObserver}
            onToggle={() => toggleDay(challenge.id)}
            onLockedClick={() => openAuthBarrier(challenge.id)}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Skeleton loader ─── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border-subtle)] last:border-b-0 animate-pulse">
      <div className="w-9 flex items-center justify-center">
        <div className="w-4 h-4 rounded-sm bg-[var(--bg-subtle)]" />
      </div>
      <div className="w-10 h-3 rounded bg-[var(--bg-subtle)]" />
      <div className="flex-1 h-3 rounded bg-[var(--bg-subtle)]" />
      <div className="w-20 h-3 rounded bg-[var(--bg-subtle)] hidden md:block" />
      <div className="w-10 h-5 rounded bg-[var(--bg-subtle)]" />
    </div>
  );
}

function SkeletonPhase({ rows = 8 }: { rows?: number }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-3">
        <div className="w-40 h-4 rounded bg-[var(--bg-subtle)] animate-pulse" />
        <div className="w-20 h-3 rounded bg-[var(--bg-subtle)] animate-pulse" />
      </div>
      <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden bg-[var(--bg-surface)]">
        {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    </section>
  );
}

/* ─── Dashboard ─── */
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

  const allowedCategories = useMemo(() => {
    if (user?.organization?.allowedCategories && user.organization.allowedCategories.length > 0) {
      return user.organization.allowedCategories;
    }
    return []; // No restriction for guests and regular learners
  }, [user]);

  const categoryOptions = useMemo(() => {
    if (allowedCategories.length > 0) {
      return allowedCategories;
    }
    return CS_CATEGORIES.map((c) => c.name);
  }, [allowedCategories]);

  useEffect(() => { fetchChallenges(); }, []);

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
      const matchesDiff = selectedDifficulty === 'ALL' || c.difficulty.toUpperCase() === selectedDifficulty;
      const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
      const matchesOrgCategories = allowedCategories.length === 0 || allowedCategories.includes(c.category);
      return matchesSearch && matchesDiff && matchesCategory && matchesOrgCategories;
    });
  }, [challenges, searchQuery, selectedDifficulty, selectedCategory, allowedCategories]);

  const phase1 = filteredChallenges.filter((c) => c.id >= 1  && c.id <= 30);
  const phase2 = filteredChallenges.filter((c) => c.id >= 31 && c.id <= 60);
  const phase3 = filteredChallenges.filter((c) => c.id >= 61 && c.id <= 90);

  const completedCount = progress.completedDays.length;
  const overallPct = Math.round((completedCount / 90) * 100);

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />

      {/* ── Context banners ── */}
      {isGuest && (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 sm:px-8 py-2.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-secondary)]">
              Guest preview — days 1–3 unlocked. Sign up to save progress and access all 90 days.
            </p>
            <button
              onClick={() => openAuthBarrier()}
              className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      )}

      {user?.role === 'ADMIN' && (
        <div className="border-b border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 px-4 sm:px-8 py-2.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-xs text-rose-700 dark:text-rose-400">
              Admin inspection mode — student completion records are read-only.
            </p>
            <Link
              href="/admin"
              className="shrink-0 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 transition-colors"
            >
              Admin console →
            </Link>
          </div>
        </div>
      )}

      {user?.role === 'ORGANIZATION' && (
        <div className="border-b border-[var(--accent-border)] bg-[var(--accent-subtle)] px-4 sm:px-8 py-2.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-xs text-[var(--accent)] dark:text-indigo-300">
              Organization preview mode — you are inspecting the curriculum assigned to your team.
            </p>
            <Link
              href="/organization"
              className="shrink-0 text-xs font-semibold text-[var(--accent)] hover:opacity-75 transition-opacity"
            >
              Team dashboard →
            </Link>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main id="main" className="max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 flex-1 space-y-10">

        {/* Page heading + overall progress */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              90-day CS mastery
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-[55ch]">
              Daily problems across algorithms, data structures, and system design.
            </p>
          </div>

          {/* Overall progress pill */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-1.5 w-36 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="font-mono text-xs text-[var(--text-faint)] tabular-nums">
              {completedCount}/90
            </span>
          </div>
        </div>

        {/* Language selector — plain button strip, no card wrapper */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Language
              {user?.organization && (
                <span className="ml-2 text-[10px] text-[var(--accent)] font-mono">
                  {user.organization.name} policy
                </span>
              )}
            </span>
            <span className="text-[11px] text-[var(--text-faint)]">Solutions and workspace update per selection</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {PROGRAMMING_LANGUAGES.map((lang) => {
              const isAllowed = allowedLanguages.includes(lang.id);
              const isActive = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  disabled={!isAllowed}
                  onClick={() => isAllowed && setSelectedLanguage(lang.id)}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                      : isAllowed
                      ? 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                      : 'opacity-30 cursor-not-allowed bg-[var(--bg-subtle)] text-[var(--text-faint)]'
                  }`}
                  title={!isAllowed ? 'Restricted by organization curriculum' : ''}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters — inline, minimal */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title, category, or day number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] w-60 transition-colors"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer transition-colors"
          >
            <option value="ALL">All difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] cursor-pointer max-w-[180px] transition-colors"
          >
            <option value="ALL">All categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* ── Challenge phases ── */}
        {loading || fetching ? (
          <>
            <SkeletonPhase rows={10} />
            <SkeletonPhase rows={10} />
            <SkeletonPhase rows={10} />
          </>
        ) : (
          <>
            {phase1.length > 0 && (
              <PhaseSection
                title="Foundations & algorithmic thinking"
                range="Days 1–30"
                challenges={phase1}
                progress={progress}
                isGuest={isGuest}
                isObserver={isObserver}
                toggleDay={toggleDay}
                openAuthBarrier={openAuthBarrier}
              />
            )}
            {phase2.length > 0 && (
              <PhaseSection
                title="Advanced data structures & traversal"
                range="Days 31–60"
                challenges={phase2}
                progress={progress}
                isGuest={isGuest}
                isObserver={isObserver}
                toggleDay={toggleDay}
                openAuthBarrier={openAuthBarrier}
              />
            )}
            {phase3.length > 0 && (
              <PhaseSection
                title="Dynamic programming & system design"
                range="Days 61–90"
                challenges={phase3}
                progress={progress}
                isGuest={isGuest}
                isObserver={isObserver}
                toggleDay={toggleDay}
                openAuthBarrier={openAuthBarrier}
              />
            )}

            {filteredChallenges.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm font-medium text-[var(--text-secondary)]">No challenges match your filters</p>
                <p className="text-xs text-[var(--text-faint)] mt-1">Try adjusting the keyword, difficulty, or category.</p>
              </div>
            )}
          </>
        )}
      </main>

      <AuthBarrierModal
        isOpen={authBarrier.isOpen}
        onClose={closeAuthBarrier}
        dayId={authBarrier.dayId}
      />
    </div>
  );
}
