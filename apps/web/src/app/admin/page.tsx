'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { adminService } from '@/services/admin.service';
import { ChallengeReviewModal, ChallengeEditModal, UserManagementTable } from '@/features/admin';
import { Challenge } from '@shared/types';
import { AdminStatsResponse } from '@shared/contracts';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [fetching, setFetching] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'PENDING' | 'CORE' | 'BONUS' | 'ALL' | 'USERS'>('PENDING');
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)] text-zinc-500 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return null;
  }

  const filteredChallenges = challenges.filter((c) => {
    if (activeTab === 'PENDING' && c.status !== 'PENDING' && c.status !== 'ORG_APPROVED') return false;
    if (activeTab === 'CORE' && c.type !== 'CORE') return false;
    if (activeTab === 'BONUS' && (c.type !== 'BONUS' || c.status === 'PENDING' || c.status === 'ORG_APPROVED')) return false;
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

  const pendingCount = challenges.filter((c) => c.status === 'PENDING' || c.status === 'ORG_APPROVED').length;

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-[var(--badge-easy-bg)] text-[var(--badge-easy-text)] border-[var(--badge-easy-border)]';
      case 'medium':
        return 'bg-[var(--badge-medium-bg)] text-[var(--badge-medium-text)] border-[var(--badge-medium-border)]';
      case 'hard':
        return 'bg-[var(--badge-hard-bg)] text-[var(--badge-hard-text)] border-[var(--badge-hard-border)]';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'ORG_APPROVED':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'PENDING_ORG':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'PENDING':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'REJECTED':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col transition-colors">
      <Header customTitle="Admin Console" />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Header Title & New Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
                ADMIN CONSOLE
              </span>
              <h1 className="font-display text-xl font-bold text-zinc-900 dark:text-white tracking-tight">System &amp; Curriculum Control</h1>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Manage challenges, review community submissions, monitor platform metrics, and oversee users and organizations.
            </p>
          </div>

          <button
            onClick={() => {
              setEditChallenge(null);
              setShowEditModal(true);
            }}
            className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Challenge</span>
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <div className="p-3.5 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Learners</span>
              <p className="font-display text-xl font-bold text-zinc-900 dark:text-white mt-1 tabular-nums">{stats.totalUsers}</p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Organizations</span>
              <p className="font-display text-xl font-bold text-zinc-900 dark:text-white mt-1 tabular-nums">{stats.totalOrganizations ?? 0}</p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Challenges</span>
              <p className="font-display text-xl font-bold text-zinc-900 dark:text-white mt-1 tabular-nums">{stats.totalChallenges}</p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Core 90-Day</span>
              <p className="font-display text-xl font-bold text-zinc-900 dark:text-white mt-1 tabular-nums">{stats.coreChallenges}</p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Bonus</span>
              <p className="font-display text-xl font-bold text-zinc-900 dark:text-white mt-1 tabular-nums">{stats.bonusChallenges}</p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pending</span>
              <p className="font-display text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">{stats.pendingChallenges}</p>
            </div>
            <div className="p-3.5 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xs">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Completions</span>
              <p className="font-display text-xl font-bold text-zinc-900 dark:text-white mt-1 tabular-nums">{stats.totalCompletions}</p>
            </div>
          </div>
        )}

        {/* Filters & Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-zinc-100 dark:bg-[#14161b] p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'PENDING'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 tabular-nums">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('CORE')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'CORE'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Core (90 Days)
            </button>

            <button
              onClick={() => setActiveTab('BONUS')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'BONUS'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Bonus
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              All Challenges
            </button>

            <button
              onClick={() => setActiveTab('USERS')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'USERS'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Users &amp; Orgs</span>
            </button>
          </div>

          {/* Search (only for challenge tables) */}
          {activeTab !== 'USERS' && (
            <div className="relative w-full sm:w-64">
              <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Conditional Content: User Directory or Challenge Table */}
        {activeTab === 'USERS' ? (
          <UserManagementTable />
        ) : (
          <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-[#0c0d10] border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/70">
                  {filteredChallenges.length > 0 ? (
                    filteredChallenges.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">{c.id}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white max-w-xs truncate">{c.title}</td>
                        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{c.category}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(
                              c.difficulty
                            )}`}
                          >
                            {c.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              c.type === 'CORE'
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            }`}
                          >
                            {c.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(
                              c.status
                            )}`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                          {c.authorName ? `@${c.authorName}` : 'Curriculum'}
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                          {c.status === 'PENDING' || c.status === 'ORG_APPROVED' ? (
                            <button
                              onClick={() => setReviewChallenge(c)}
                              className="px-2.5 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-[11px] hover:opacity-90 transition-all shadow-xs"
                            >
                              Review &amp; Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setEditChallenge(c);
                                setShowEditModal(true);
                              }}
                              className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-[11px] transition-colors"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(c.id)}
                            className="px-2.5 py-1 rounded-md text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[11px] transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-zinc-400 dark:text-zinc-500 font-mono">
                        No challenges found in this view.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Review Modal */}
      {reviewChallenge && (
        <ChallengeReviewModal
          challenge={reviewChallenge}
          isOpen={!!reviewChallenge}
          onClose={() => setReviewChallenge(null)}
          onApprove={() => handleApprove(reviewChallenge.id)}
          onReject={(reason) => handleReject(reviewChallenge.id, reason)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <ChallengeEditModal
          challenge={editChallenge}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditChallenge(null);
          }}
          onSave={(data) => handleSaveChallenge(editChallenge?.id || null, data)}
        />
      )}
    </div>
  );
}
