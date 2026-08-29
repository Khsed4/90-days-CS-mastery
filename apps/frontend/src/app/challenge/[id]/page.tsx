'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/layout/Header';
import { challengeService } from '../../../services/challenge.service';
import { translations } from '../../../lib/translations';
import { AuthBarrierModal } from '../../../components/auth/AuthBarrierModal';
import { Challenge } from '@shared';
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

  const t = translations[progress.interfaceLang || 'en'] || translations.en;

  useEffect(() => {
    // If guest and dayId > 3, trigger barrier
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
      // Trigger confetti on completing a challenge!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#38bdf8', '#4ade80', '#fbbf24'],
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

  if (loading || fetching || !challenge) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary, #94a3b8)',
        }}
      >
        <i
          className="fa-solid fa-spinner fa-spin"
          style={{ fontSize: '2.5rem', color: 'var(--color-primary, #6366f1)' }}
        ></i>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="workspace-layout">
        {/* Left Panel: Challenge Problem & Prerequisite */}
        <div className="problem-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted, #64748b)' }}>
                {challenge.type === 'CORE' ? `DAY ${challenge.id}` : `BONUS #${challenge.id}`}
              </span>
              <span className={`badge ${challenge.difficulty.toLowerCase()}`}>
                {challenge.difficulty}
              </span>
              {challenge.id <= 3 && challenge.type === 'CORE' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ade80',
                    fontWeight: '700',
                  }}
                >
                  Free Trial
                </span>
              )}
              {challenge.authorName && (
                <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                  by @{challenge.authorName}
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
              {challenge.category}
            </span>
          </div>

          <h1 className="problem-title">{challenge.title}</h1>

          {/* Prerequisite Box */}
          <div className="prereq-box">
            <div className="prereq-title">
              <i className="fa-solid fa-lightbulb"></i> {t.prereqTitle}
            </div>
            <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{challenge.prerequisite}</p>
          </div>

          {/* Description */}
          <div className="section-title">{t.challengeDesc}</div>
          <p className="problem-desc">{challenge.description}</p>

          {/* Examples */}
          <div className="section-title">{t.examplesLabel}</div>
          <div className="example-box" style={{ whiteSpace: 'pre-line' }}>
            {challenge.examples}
          </div>

          {/* Constraints */}
          <div className="section-title">{t.constraintsLabel}</div>
          <div className="constraints-list" style={{ whiteSpace: 'pre-line' }}>
            {challenge.constraints}
          </div>

          {/* Bottom Complete Button & Navigation */}
          <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {id > 1 && (
                <Link
                  href={`/challenge/${id - 1}`}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  ← {t.prev} ({id - 1})
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
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              >
                {t.next} ({id + 1}) →
              </button>
            </div>

            <button
              onClick={handleToggle}
              className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
              style={{
                background: isCompleted ? 'rgba(34, 197, 94, 0.15)' : undefined,
                borderColor: isCompleted ? 'rgba(34, 197, 94, 0.4)' : undefined,
                color: isCompleted ? '#4ade80' : undefined,
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: '700',
              }}
            >
              <i className={`fa-solid ${isCompleted ? 'fa-circle-check' : 'fa-check'}`}></i>
              {isCompleted ? t.completed : t.markComplete}
            </button>
          </div>
        </div>

        {/* Right Panel: Solution Viewer */}
        <div className="editor-panel">
          <div className="editor-tabs">
            <div className="lang-buttons">
              <button
                onClick={() => setSelectedCodeLang('java')}
                className={`lang-btn ${selectedCodeLang === 'java' ? 'active' : ''}`}
              >
                Java
              </button>
              <button
                onClick={() => setSelectedCodeLang('ts')}
                className={`lang-btn ${selectedCodeLang === 'ts' ? 'active' : ''}`}
              >
                TypeScript
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setSolutionRevealed(!solutionRevealed)}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                <i className={`fa-solid ${solutionRevealed ? 'fa-eye-slash' : 'fa-eye'}`}></i>{' '}
                {solutionRevealed ? 'Hide Solution' : t.revealSolution}
              </button>
              {solutionRevealed && (
                <button
                  onClick={copyCode}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                >
                  <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>{' '}
                  {copied ? t.copyBubble : 'Copy Code'}
                </button>
              )}
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {solutionRevealed ? (
              <pre
                style={{
                  margin: 0,
                  padding: '1.25rem',
                  height: '100%',
                  overflowY: 'auto',
                  background: 'rgba(10, 15, 30, 0.95)',
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: '#e2e8f0',
                }}
              >
                <code>{selectedCodeLang === 'java' ? challenge.java : challenge.ts}</code>
              </pre>
            ) : (
              <div className="solution-blur-overlay">
                <i className="fa-solid fa-code" style={{ fontSize: '3rem', color: 'var(--color-primary, #6366f1)', marginBottom: '1rem' }}></i>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>{t.solutionLocked}</h3>
                <p style={{ maxWidth: '400px', fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', marginBottom: '1.25rem' }}>
                  {t.solutionLockedSub}
                </p>
                <button
                  onClick={() => setSolutionRevealed(true)}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.25rem' }}
                >
                  <i className="fa-solid fa-unlock"></i> {t.revealSolution}
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
