'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { adminService } from '@/services/admin.service';
import { ChallengeReviewModal, ChallengeEditModal } from '@/features/admin';
import { Challenge } from '@shared/types';
import { AdminStatsResponse } from '@shared/contracts';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
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
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-rose-500"></i>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return null;
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'PENDING':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'REJECTED':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header customTitle="Admin Console" />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Header Title & New Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                ADMIN CONSOLE
              </span>
              <h1 className="text-xl font-bold text-white tracking-tight">Curriculum & Moderation</h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Manage core challenges, review community submissions, and monitor platform metrics.
            </p>
          </div>

          <button
            onClick={() => {
              setEditChallenge(null);
              setShowEditModal(true);
            }}
            className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0 shadow-sm"
          >
            <i className="fa-solid fa-plus mr-1.5"></i> Add Challenge
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Users</span>
              <p className="text-xl font-bold text-white mt-1">{stats.totalUsers}</p>
            </div>
            <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Challenges</span>
              <p className="text-xl font-bold text-white mt-1">{stats.totalChallenges}</p>
            </div>
            <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Core Curriculum</span>
              <p className="text-xl font-bold text-blue-400 mt-1">{stats.coreChallenges}</p>
            </div>
            <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Bonus Approved</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{stats.bonusChallenges}</p>
            </div>
            <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Pending Review</span>
              <p className="text-xl font-bold text-amber-400 mt-1">{stats.pendingChallenges}</p>
            </div>
            <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Completions</span>
              <p className="text-xl font-bold text-purple-400 mt-1">{stats.totalCompletions}</p>
            </div>
          </div>
        )}

        {/* Filters & Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-md border border-zinc-800">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'PENDING'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('CORE')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                activeTab === 'CORE'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Core (90 Days)
            </button>

            <button
              onClick={() => setActiveTab('BONUS')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                activeTab === 'BONUS'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Bonus
            </button>

            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500"></i>
            <input
              type="text"
              placeholder="Search table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
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
              <tbody className="divide-y divide-zinc-800/60">
                {filteredChallenges.length > 0 ? (
                  filteredChallenges.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-zinc-400">{c.id}</td>
                      <td className="px-4 py-3 font-medium text-white max-w-xs truncate">{c.title}</td>
                      <td className="px-4 py-3 text-zinc-400">{c.category}</td>
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
                              ? 'bg-blue-950 text-blue-400'
                              : 'bg-purple-950 text-purple-400'
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
                      <td className="px-4 py-3 text-zinc-400">
                        {c.authorName ? `@${c.authorName}` : 'Curriculum'}
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        {c.status === 'PENDING' ? (
                          <button
                            onClick={() => setReviewChallenge(c)}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditChallenge(c);
                              setShowEditModal(true);
                            }}
                            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium text-[11px] transition-colors"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-400 font-medium text-[11px] border border-rose-800/80 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                      No challenges found in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
