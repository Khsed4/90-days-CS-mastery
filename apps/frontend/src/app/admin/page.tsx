'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/layout/Header';
import { adminService } from '../../services/admin.service';
import { ChallengeReviewModal } from '../../components/admin/ChallengeReviewModal';
import { ChallengeEditModal } from '../../components/admin/ChallengeEditModal';
import { Challenge, AdminStatsDto, ChallengeType, ChallengeStatus } from '@shared';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStatsDto | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [fetching, setFetching] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CORE' | 'BONUS'>('PENDING');
  const [search, setSearch] = useState('');

  // Modals
  const [reviewChallenge, setReviewChallenge] = useState<Challenge | null>(null);
  const [editChallenge, setEditChallenge] = useState<Challenge | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadData = useCallback(async () => {
    setFetching(true);
    try {
      const [statsData, listData] = await Promise.all([
        adminService.getStats(),
        adminService.getChallenges(),
      ]);
      setStats(statsData);
      setChallenges(listData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/');
        return;
      }
      loadData();
    }
  }, [user, loading, router, loadData]);

  const handleApprove = async (id: number) => {
    await adminService.reviewChallenge(id, { status: 'APPROVED' });
    await loadData();
  };

  const handleReject = async (id: number, reason: string) => {
    await adminService.reviewChallenge(id, { status: 'REJECTED', rejectionReason: reason });
    await loadData();
  };

  const handleSaveChallenge = async (id: number | null, data: any) => {
    if (id) {
      await adminService.updateChallenge(id, data);
    } else {
      await adminService.createChallenge(data);
    }
    await loadData();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete challenge #${id}?`)) return;
    await adminService.deleteChallenge(id);
    await loadData();
  };

  if (loading || (!user && fetching)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: '#f87171' }}></i>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return null;
  }

  // Filtered list
  const filteredChallenges = challenges.filter((c) => {
    if (activeTab === 'PENDING' && c.status !== 'PENDING') return false;
    if (activeTab === 'CORE' && c.type !== 'CORE') return false;
    if (activeTab === 'BONUS' && (c.type !== 'BONUS' || c.status === 'PENDING')) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.id.toString().includes(q) ||
        (c.authorName && c.authorName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = challenges.filter((c) => c.status === 'PENDING').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090d16' }}>
      <Header customTitle="Admin Console" />

      <main style={{ maxWidth: '1300px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        {/* Title & Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.75rem' }}>🛡️</span>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: '#f8fafc' }}>
                Administration Dashboard
              </h1>
            </div>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.9rem', color: '#94a3b8' }}>
              Manage curriculum challenges, review community submissions, and view platform metrics
            </p>
          </div>

          <button
            onClick={() => {
              setEditChallenge(null);
              setShowEditModal(true);
            }}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', fontWeight: '700' }}
          >
            <i className="fa-solid fa-plus"></i> Create New Challenge
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Registered Users</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8', marginTop: '0.4rem' }}>{stats.totalUsers}</div>
            </div>

            <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Core 90 Days</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#818cf8', marginTop: '0.4rem' }}>{stats.coreChallenges}</div>
            </div>

            <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Bonus Published</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#4ade80', marginTop: '0.4rem' }}>{stats.bonusChallenges}</div>
            </div>

            <div
              className="stat-card"
              style={{
                background: pendingCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(30, 41, 59, 0.4)',
                border: `1px solid ${pendingCount > 0 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: pendingCount > 0 ? '#f87171' : '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>
                Pending Review
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: pendingCount > 0 ? '#f87171' : '#f8fafc', marginTop: '0.4rem' }}>
                {stats.pendingChallenges}
              </div>
            </div>

            <div className="stat-card" style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>Total Completions</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24', marginTop: '0.4rem' }}>{stats.totalCompletions}</div>
            </div>
          </div>
        )}

        {/* Challenge Management Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Filters & Search Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('PENDING')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'PENDING' ? '#ef4444' : 'transparent',
                  color: activeTab === 'PENDING' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                ⏳ Pending Review ({pendingCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'ALL' ? '#6366f1' : 'transparent',
                  color: activeTab === 'ALL' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                All ({challenges.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CORE')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'CORE' ? '#6366f1' : 'transparent',
                  color: activeTab === 'CORE' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Core (90 Days)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('BONUS')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '7px',
                  border: 'none',
                  background: activeTab === 'BONUS' ? '#06b6d4' : 'transparent',
                  color: activeTab === 'BONUS' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Bonus ({stats?.bonusChallenges || 0})
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '260px' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, category, author..."
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.8rem',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'rgba(0, 0, 0, 0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700' }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700' }}>Title</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700' }}>Difficulty</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700' }}>Type</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700' }}>Author</th>
                  <th style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallenges.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                      No challenges found matching this filter.
                    </td>
                  </tr>
                ) : (
                  filteredChallenges.map((c) => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontWeight: '700' }}>#{c.id}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: '600', color: '#f8fafc' }}>
                        {c.title}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${c.difficulty.toLowerCase()}`}>{c.difficulty}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{c.category}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: c.type === 'CORE' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                            color: c.type === 'CORE' ? '#818cf8' : '#38bdf8',
                          }}
                        >
                          {c.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
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
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(100, 116, 139, 0.15)',
                            color:
                              c.status === 'APPROVED'
                                ? '#4ade80'
                                : c.status === 'PENDING'
                                ? '#f87171'
                                : '#94a3b8',
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                        {c.authorName || 'Platform'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          {c.status === 'PENDING' && (
                            <button
                              onClick={() => setReviewChallenge(c)}
                              className="btn btn-primary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              Review
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditChallenge(c);
                              setShowEditModal(true);
                            }}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Review Modal */}
      <ChallengeReviewModal
        challenge={reviewChallenge}
        isOpen={Boolean(reviewChallenge)}
        onClose={() => setReviewChallenge(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Edit/Create Modal */}
      <ChallengeEditModal
        challenge={editChallenge}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveChallenge}
      />
    </div>
  );
}
