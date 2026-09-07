'use client';

import React, { useEffect, useState } from 'react';
import { useAuth, AuthBarrierModal } from '@/features/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { challengeService } from '@/services/challenge.service';
import { translations } from '@/lib/translations';
import { Challenge } from '@shared/types';
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
  } = useAuth();
  const router = useRouter();

  const id = parseInt(params.id, 10) || 1;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [fetching, setFetching] = useState(true);
  const [selectedCodeLang, setSelectedCodeLang] = useState<'java' | 'ts'>('java');
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b'],
      });
    }
  };

  const copyCode = () => {
    if (!solutionRevealed || !challenge) return;
    const code = selectedCodeLang === 'java' ? challenge.java : challenge.ts;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800';
      case 'medium':
        return 'bg-amber-950/60 text-amber-400 border-amber-800';
      case 'hard':
        return 'bg-rose-950/60 text-rose-400 border-rose-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  if (loading || fetching || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-blue-500"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header showBackToHub={true} />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem & Prerequisite */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg p-5 space-y-5">
          {/* Challenge Meta */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                {challenge.type === 'CORE' ? `Day ${challenge.id}` : `Bonus #${challenge.id}`}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(
                  challenge.difficulty
                )}`}
              >
                {challenge.difficulty}
              </span>
              {challenge.id <= 3 && challenge.type === 'CORE' && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Free Trial
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-400">{challenge.category}</span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{challenge.title}</h1>
            {challenge.authorName && (
              <p className="text-xs text-zinc-400 mt-1">Submitted by @{challenge.authorName}</p>
            )}
          </div>

          {/* Prerequisite Callout */}
          <div className="p-3.5 bg-blue-950/30 border border-blue-800/60 rounded-md">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
              <i className="fa-regular fa-lightbulb"></i>
              <span>{t.prereqTitle}</span>
            </div>
            <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
              {challenge.prerequisite}
            </p>
          </div>

          {/* Problem Description */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.challengeDesc}
            </h2>
            <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.examplesLabel}
            </h2>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed">
              {challenge.examples}
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.constraintsLabel}
            </h2>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed">
              {challenge.constraints}
            </div>
          </div>

          {/* Actions & Navigation */}
          <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {id > 1 && (
                <Link
                  href={`/challenge/${id - 1}`}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  ← Prev ({id - 1})
                </Link>
              )}
              <button
                onClick={() => {
                  if (isGuest && id + 1 > 3) {
                    openAuthBarrier(id + 1);
                  } else {
                    router.push(`/challenge/${id + 1}`);
                  }
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                Next ({id + 1}) →
              </button>
            </div>

            {user?.role === 'ADMIN' ? (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-rose-950/60 border border-rose-800/80 text-rose-300">
                <i className="fa-solid fa-shield-halved text-rose-400"></i>
                <span>Admin Inspection Mode</span>
              </div>
            ) : user?.role === 'ORGANIZATION' ? (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-purple-950/60 border border-purple-800/80 text-purple-300">
                <i className="fa-solid fa-building text-purple-400"></i>
                <span>Organization Preview</span>
              </div>
            ) : (
              <button
                onClick={handleToggle}
                className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isCompleted
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/60'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <i className={`fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-check'} text-xs`}></i>
                <span>{isCompleted ? t.completed : t.markComplete}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Reference Solution */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {/* Editor Header / Controls */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-md border border-zinc-800">
              <button
                onClick={() => setSelectedCodeLang('java')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedCodeLang === 'java'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Java
              </button>
              <button
                onClick={() => setSelectedCodeLang('ts')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedCodeLang === 'ts'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                TypeScript
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSolutionRevealed(!solutionRevealed)}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <i className={`fa-solid ${solutionRevealed ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                <span>{solutionRevealed ? 'Hide Solution' : t.revealSolution}</span>
              </button>

              {solutionRevealed && (
                <button
                  onClick={copyCode}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <i className={`fa-solid ${copied ? 'fa-check text-emerald-400' : 'fa-copy'} text-xs`}></i>
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Viewer or Locked State */}
          <div className="flex-1 p-4 bg-zinc-950 font-mono text-xs leading-relaxed text-zinc-200 overflow-auto min-h-[420px]">
            {solutionRevealed ? (
              <pre className="overflow-x-auto whitespace-pre font-mono text-xs leading-relaxed text-zinc-200">
                <code>{selectedCodeLang === 'java' ? challenge.java : challenge.ts}</code>
              </pre>
            ) : (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 text-lg">
                  <i className="fa-solid fa-code"></i>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{t.solutionLocked}</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mt-1">{t.solutionLockedSub}</p>
                </div>
                <button
                  onClick={() => setSolutionRevealed(true)}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  <i className="fa-solid fa-unlock mr-1.5"></i>
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
