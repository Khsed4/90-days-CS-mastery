'use client';

import React, { useEffect, useState } from 'react';
import { useAuth, AuthBarrierModal } from '@/features/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { challengeService } from '@/services/challenge.service';
import { translations } from '@/lib/translations';
import { Challenge, ProgrammingLanguage } from '@shared/types';
import { PROGRAMMING_LANGUAGES } from '@shared/constants';
import { getStarterCode, LANGUAGE_FILE_NAMES } from '@shared/utils';
import confetti from 'canvas-confetti';

export default function WorkspacePage({ params }: { params: { id: string } }) {
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
  const router = useRouter();

  const id = parseInt(params.id, 10) || 1;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [fetching, setFetching] = useState(true);
  const [solutionRevealed, setSolutionRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = translations.en;

  useEffect(() => {
    if (!loading && isGuest && id > 3) {
      openAuthBarrier(id);
    }
    fetchChallenge();
    setSolutionRevealed(false);
  }, [id, isGuest, loading]);

  const fetchChallenge = async () => {
    setFetching(true);
    try {
      const data = await challengeService.getChallengeById(id);
      setChallenge(data);
    } catch (err) {
      console.error('Error loading challenge:', err);
    } finally {
      setFetching(false);
    }
  };

  const isCompleted = challenge ? progress.completedDays.includes(challenge.id) : false;

  const handleToggle = async () => {
    if (!challenge) return;
    const success = await toggleDay(challenge.id);
    if (success && !isCompleted) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#18181b', '#10b981', '#f59e0b', '#6366f1'],
      });
    }
  };

  const activeCode = challenge
    ? getStarterCode(
        challenge.title,
        selectedLanguage,
        challenge.ts,
        challenge.java,
        challenge.solutions,
      )
    : '';

  const copyCode = () => {
    if (!solutionRevealed || !challenge) return;
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-[var(--diff-easy-bg)] text-[var(--diff-easy-text)]';
      case 'medium':
        return 'bg-[var(--diff-med-bg)] text-[var(--diff-med-text)]';
      case 'hard':
        return 'bg-[var(--diff-hard-bg)] text-[var(--diff-hard-text)]';
      default:
        return 'bg-[var(--bg-subtle)] text-[var(--text-muted)]';
    }
  };

  if (loading || fetching || !challenge) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--bg-canvas)]">
        <div className="w-5 h-5 rounded-full border-2 border-[var(--border-mid)] border-t-[var(--accent)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
      <Header showBackToHub={true} />

      <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem & Prerequisite */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-6 space-y-6">
          {/* Challenge Meta */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--text-faint)] tabular-nums">
                {challenge.type === 'CORE' ? `Day ${challenge.id}` : `Bonus #${challenge.id}`}
              </span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${getDifficultyBadge(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
              {challenge.id <= 3 && challenge.type === 'CORE' && (
                <span className="text-[10px] text-[var(--diff-easy-text)] bg-[var(--diff-easy-bg)] px-1.5 py-0.5 rounded">Free</span>
              )}
            </div>
            <span className="text-[11px] text-[var(--text-faint)]">{challenge.category}</span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              {challenge.title}
            </h1>
            {challenge.authorName && (
              <p className="text-xs text-[var(--text-faint)] mt-1">Submitted by @{challenge.authorName}</p>
            )}
          </div>

          {/* Prerequisite Callout */}
          <div className="p-4 bg-[var(--accent-subtle)] border border-[var(--accent-border)] rounded-md space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              <span>{t.prereqTitle}</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
              {challenge.prerequisite}
            </p>
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-medium text-[var(--text-faint)] uppercase tracking-widest">{t.challengeDesc}</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <h2 className="text-xs font-medium text-[var(--text-faint)] uppercase tracking-widest">{t.examplesLabel}</h2>
            <div className="p-3.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-md text-xs font-mono text-[var(--text-secondary)] whitespace-pre-line leading-relaxed overflow-x-auto">
              {challenge.examples}
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <h2 className="text-xs font-medium text-[var(--text-faint)] uppercase tracking-widest">{t.constraintsLabel}</h2>
            <div className="p-3.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-md text-xs font-mono text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
              {challenge.constraints}
            </div>
          </div>

          {/* Actions & Navigation */}
          <div className="mt-auto pt-5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {id > 1 && (
                <Link
                  href={`/challenge/${id - 1}`}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors active:scale-95"
                >
                  ← {id - 1}
                </Link>
              )}
              <button
                onClick={() => {
                  if (isGuest && id + 1 > 3) openAuthBarrier(id + 1);
                  else router.push(`/challenge/${id + 1}`);
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors active:scale-95"
              >
                {id + 1} →
              </button>
            </div>

            {user?.role === 'ADMIN' ? (
              <span className="text-xs text-rose-600 dark:text-rose-400 font-mono">Admin view</span>
            ) : user?.role === 'ORGANIZATION' ? (
              <span className="text-xs text-[var(--accent)] font-mono">Org view</span>
            ) : (
              <button
                onClick={handleToggle}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 ${
                  isCompleted
                    ? 'bg-[var(--diff-easy-bg)] text-[var(--diff-easy-text)]'
                    : 'bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-80'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                ) : null}
                <span>{isCompleted ? t.completed : t.markComplete}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Reference Solution */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
          {/* Editor Header / Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] gap-2">
            {/* Multi-Language Switcher */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {PROGRAMMING_LANGUAGES.filter((l) => allowedLanguages.includes(l.id)).map((lang) => {
                const isActive = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                        : 'bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-mid)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {lang.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="font-mono text-[11px] text-[var(--text-faint)] px-2 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                {LANGUAGE_FILE_NAMES[selectedLanguage] || 'solution.txt'}
              </span>

              <button
                onClick={() => setSolutionRevealed(!solutionRevealed)}
                className="px-2.5 py-1 rounded-md text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-mid)] transition-colors active:scale-95 flex items-center gap-1.5"
              >
                {solutionRevealed ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                <span>{solutionRevealed ? 'Hide' : t.revealSolution}</span>
              </button>

              {solutionRevealed && (
                <button
                  onClick={copyCode}
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-mid)] transition-colors active:scale-95 flex items-center gap-1.5"
                >
                  {copied ? (
                    <svg className="w-3 h-3 text-[var(--diff-easy-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  )}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Viewer or Locked State */}
          <div className="flex-1 p-5 bg-[var(--bg-subtle)] font-mono text-xs leading-relaxed text-[var(--text-secondary)] overflow-auto min-h-[440px]">
            {solutionRevealed ? (
              <pre className="overflow-x-auto whitespace-pre font-mono text-xs leading-relaxed">
                <code>{activeCode}</code>
              </pre>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-5">
                <div className="w-10 h-10 rounded-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-faint)]">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{t.solutionLocked}</h3>
                  <p className="text-xs text-[var(--text-muted)] max-w-xs mt-1">{t.solutionLockedSub}</p>
                </div>
                <button
                  onClick={() => setSolutionRevealed(true)}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-[var(--bg-canvas)] bg-[var(--text-primary)] hover:opacity-80 transition-opacity active:scale-95"
                >
                  {t.revealSolution}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Barrier Modal */}
      <AuthBarrierModal
        isOpen={authBarrier.isOpen}
        dayId={authBarrier.dayId}
        onClose={() => {
          closeAuthBarrier();
          if (isGuest && id > 3) {
            router.push('/');
          }
        }}
        onSuccess={() => {
          fetchChallenge();
        }}
      />
    </div>
  );
}
