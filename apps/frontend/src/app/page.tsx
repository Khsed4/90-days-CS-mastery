'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { Header } from '../components/layout/Header';
import { challengeService } from '../services/challenge.service';
import { translations } from '../lib/translations';
import { AuthBarrierModal } from '../components/auth/AuthBarrierModal';
import { Challenge } from '@shared';

function ChallengeItem({
  challenge,
  isCompleted,
  isLocked,
  onToggle,
  onLockedClick,
}: {
  challenge: Challenge;
  isCompleted: boolean;
  isLocked: boolean;
  onToggle: () => void;
  onLockedClick: () => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockedClick();
    }
  };

  return (
    <Link
      href={`/challenge/${challenge.id}`}
      onClick={handleClick}
      style={{
        background: isCompleted
          ? 'rgba(6, 182, 212, 0.05)'
          : isLocked
          ? 'rgba(15, 23, 42, 0.4)'
          : 'rgba(255, 255, 255, 0.02)',
        border: `1px solid ${
          isCompleted
            ? 'rgba(6, 182, 212, 0.4)'
            : isLocked
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(255, 255, 255, 0.08)'
        }`,
        borderRadius: '14px',
        padding: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        opacity: isLocked ? 0.75 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            accentColor: 'var(--color-primary, #6366f1)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: '800',
                color: isCompleted ? '#38bdf8' : 'var(--text-muted, #64748b)',
                textTransform: 'uppercase',
              }}
            >
              Day {challenge.id}
            </span>
            {challenge.id <= 3 && (
              <span
                style={{
                  fontSize: '0.6rem',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#4ade80',
                  fontWeight: '700',
                }}
              >
                Free Trial
              </span>
            )}
            {isLocked && (
              <span
                style={{
                  fontSize: '0.6rem',
                  padding: '2px 6px',
                  borderRadius: '999px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  fontWeight: '700',
                }}
              >
                🔒 Login to unlock
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text-main, #f8fafc)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginTop: '2px',
            }}
          >
            {challenge.title}
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.3rem',
          flexShrink: 0,
        }}
      >
        <span className={`badge ${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted, #64748b)' }}>
          {challenge.category}
        </span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const {
    isGuest,
    loading,
    progress,
    toggleDay,
    authBarrier,
    openAuthBarrier,
    closeAuthBarrier,
  } = useAuth();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [fetching, setFetching] = useState(true);

  const t = translations[progress.interfaceLang || 'en'] || translations.en;

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

  if (loading || fetching) {
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

  const phase1 = challenges.filter((c) => c.id >= 1 && c.id <= 30);
  const phase2 = challenges.filter((c) => c.id >= 31 && c.id <= 60);
  const phase3 = challenges.filter((c) => c.id >= 61 && c.id <= 90);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Shared Header */}
      <Header />

      {/* Guest Trial Alert Banner */}
      {isGuest && (
        <div
          style={{
            maxWidth: '1200px',
            width: '100%',
            margin: '1.25rem auto 0 auto',
            padding: '0 1.5rem',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚀</span>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                  Guest Trial Active: Days 1, 2, and 3 are unlocked!
                </strong>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Complete the first 3 challenges freely. Sign up with email verification to unlock all 90 days, bonus challenges, and sync your cloud progress.
                </p>
              </div>
            </div>
            <button
              onClick={() => openAuthBarrier()}
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Sign Up & Cloud Sync
            </button>
          </div>
        </div>
      )}

      {/* Main Roadmap Container */}
      <main className="roadmap-container">
        {/* Phase 1 */}
        <section className="phase-card">
          <div className="phase-header">
            <div>
              <span className="phase-badge phase-1-badge">{t.p1Label}</span>
              <h2 className="phase-title">{t.p1Title}</h2>
              <p className="phase-desc">{t.p1Summary}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>Days 1 - 30</span>
            </div>
          </div>
          <div className="nodes-grid">
            {phase1.map((c) => (
              <ChallengeItem
                key={c.id}
                challenge={c}
                isCompleted={progress.completedDays.includes(c.id)}
                isLocked={isGuest && c.id > 3}
                onToggle={() => toggleDay(c.id)}
                onLockedClick={() => openAuthBarrier(c.id)}
              />
            ))}
          </div>
        </section>

        {/* Phase 2 */}
        <section className="phase-card">
          <div className="phase-header">
            <div>
              <span className="phase-badge phase-2-badge">{t.p2Label}</span>
              <h2 className="phase-title">{t.p2Title}</h2>
              <p className="phase-desc">{t.p2Summary}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>Days 31 - 60</span>
            </div>
          </div>
          <div className="nodes-grid">
            {phase2.map((c) => (
              <ChallengeItem
                key={c.id}
                challenge={c}
                isCompleted={progress.completedDays.includes(c.id)}
                isLocked={isGuest}
                onToggle={() => toggleDay(c.id)}
                onLockedClick={() => openAuthBarrier(c.id)}
              />
            ))}
          </div>
        </section>

        {/* Phase 3 */}
        <section className="phase-card">
          <div className="phase-header">
            <div>
              <span className="phase-badge phase-3-badge">{t.p3Label}</span>
              <h2 className="phase-title">{t.p3Title}</h2>
              <p className="phase-desc">{t.p3Summary}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>Days 61 - 90</span>
            </div>
          </div>
          <div className="nodes-grid">
            {phase3.map((c) => (
              <ChallengeItem
                key={c.id}
                challenge={c}
                isCompleted={progress.completedDays.includes(c.id)}
                isLocked={isGuest}
                onToggle={() => toggleDay(c.id)}
                onLockedClick={() => openAuthBarrier(c.id)}
              />
            ))}
          </div>
        </section>
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
