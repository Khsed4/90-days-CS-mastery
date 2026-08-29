'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/layout/Header';
import { challengeService } from '../../services/challenge.service';
import { Challenge } from '@shared';

export default function BonusChallengesPage() {
  const { user, progress, toggleDay } = useAuth();

  const [bonusChallenges, setBonusChallenges] = useState<Challenge[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Challenge[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setFetching(true);
    try {
      const [bonusData, myData] = await Promise.all([
        challengeService.getBonusChallenges(),
        user ? challengeService.getMySubmissions() : Promise.resolve([]),
      ]);
      setBonusChallenges(bonusData);
      setMySubmissions(myData);
    } catch (err) {
      console.error('Failed to load bonus challenges:', err);
    } finally {
      setFetching(false);
    }
  };

  const filteredBonus = bonusChallenges.filter((c) => {
    if (c.status !== 'APPROVED') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.authorName && c.authorName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090d16' }}>
      <Header />

      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '20px',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '3px 10px', borderRadius: '999px', background: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem' }}>
              <span>⭐</span> Community & Bonus Arena
            </div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
              Bonus Computer Science Challenges
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>
              Expand your mastery beyond the 90-day core curriculum. Solve peer-contributed challenges, or author and publish your own algorithmic problems for the community!
            </p>
          </div>

          <Link
            href="/challenges/create"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', fontWeight: '700', textDecoration: 'none' }}
          >
            <i className="fa-solid fa-plus"></i> Submit Your Challenge
          </Link>
        </div>

        {/* My Submissions Section (if logged in and has submissions) */}
        {user && mySubmissions.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
                📁 My Challenge Submissions ({mySubmissions.length})
              </h2>
              <Link href="/challenges/create" style={{ color: '#38bdf8', fontSize: '0.85rem', textDecoration: 'none' }}>
                + Add Another
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {mySubmissions.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className={`badge ${c.difficulty.toLowerCase()}`}>{c.difficulty}</span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background:
                            c.status === 'APPROVED'
                              ? 'rgba(34, 197, 94, 0.15)'
                              : c.status === 'PENDING'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            c.status === 'APPROVED'
                              ? '#4ade80'
                              : c.status === 'PENDING'
                              ? '#fbbf24'
                              : '#f87171',
                        }}
                      >
                        {c.status === 'APPROVED'
                          ? '🎉 Published'
                          : c.status === 'PENDING'
                          ? '⏳ In Review'
                          : '⚠️ Needs Revision'}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
                      {c.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{c.category}</p>

                    {c.rejectionReason && c.status === 'REJECTED' && (
                      <div
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: '8px',
                          padding: '0.5rem',
                          fontSize: '0.75rem',
                          color: '#fca5a5',
                          marginTop: '0.75rem',
                        }}
                      >
                        <strong>Feedback:</strong> {c.rejectionReason}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/challenge/${c.id}`}
                    className="btn btn-outline"
                    style={{ justifyContent: 'center', padding: '0.45rem', fontSize: '0.8rem' }}
                  >
                    View & Solve Problem →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Search & Published Bonus Challenges List */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>
              🌟 Published Bonus Challenges ({filteredBonus.length})
            </h2>

            <div style={{ position: 'relative', width: '280px' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bonus challenges..."
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.5rem 0.9rem',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {fetching ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#38bdf8' }}></i>
            </div>
          ) : filteredBonus.length === 0 ? (
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.3)',
                border: '1px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
              }}
            >
              <i className="fa-solid fa-lightbulb" style={{ fontSize: '2.5rem', color: '#38bdf8', marginBottom: '0.75rem' }}></i>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>No bonus challenges found</h3>
              <p style={{ margin: '0 0 1.25rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                Be the first to author and publish a community bonus challenge!
              </p>
              <Link href="/challenges/create" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                + Submit a Challenge
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
              {filteredBonus.map((c) => {
                const isCompleted = progress.completedDays.includes(c.id);
                return (
                  <div
                    key={c.id}
                    style={{
                      background: isCompleted ? 'rgba(6, 182, 212, 0.05)' : 'rgba(30, 41, 59, 0.4)',
                      border: `1px solid ${isCompleted ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className={`badge ${c.difficulty.toLowerCase()}`}>{c.difficulty}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          Author: <strong style={{ color: '#38bdf8' }}>{c.authorName || 'Community'}</strong>
                        </span>
                      </div>

                      <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc' }}>
                        {c.title}
                      </h3>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#94a3b8' }}>{c.category}</p>

                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: '#cbd5e1',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {c.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleDay(c.id)}
                          style={{ width: '16px', height: '16px', accentColor: '#06b6d4', cursor: 'pointer' }}
                        />
                        {isCompleted ? 'Solved' : 'Mark Solved'}
                      </label>

                      <Link
                        href={`/challenge/${c.id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        Open Workspace →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
