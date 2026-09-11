'use client';

import React, { useState, useEffect } from 'react';
import { organizationService } from '@/services/organization.service';
import { Challenge } from '@shared/types';
import Link from 'next/link';

export function OrgChallengesModeration() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING_ORG' | 'ORG_APPROVED' | 'APPROVED' | 'REJECTED'>('ALL');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Reject modal state
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await organizationService.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load team challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await organizationService.reviewChallenge(id, { status: 'ORG_APPROVED' });
      await loadChallenges();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve challenge');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    setActionLoading(rejectingId);
    try {
      await organizationService.reviewChallenge(rejectingId, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim() || undefined,
      });
      setRejectingId(null);
      setRejectionReason('');
      await loadChallenges();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject challenge');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  });

  const pendingCount = challenges.filter((c) => c.status === 'PENDING_ORG').length;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Team Challenges Moderation</h2>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Review bonus challenges submitted by members of your organization. Approving a challenge shares it across your entire team and submits it for platform-wide publishing.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
          {(['ALL', 'PENDING_ORG', 'ORG_APPROVED', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
                filter === status
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {status === 'ALL' && 'All Submissions'}
              {status === 'PENDING_ORG' && 'Awaiting Review'}
              {status === 'ORG_APPROVED' && 'Team Approved'}
              {status === 'APPROVED' && 'Global Showcase'}
              {status === 'REJECTED' && 'Rejected'}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500">Loading team challenges...</div>
      ) : filteredChallenges.length === 0 ? (
        <div className="py-12 text-center bg-zinc-950/40 rounded-xl border border-zinc-800/80 space-y-2">
          <span className="text-2xl">📝</span>
          <p className="text-xs text-zinc-400 font-medium">No challenges found matching this filter.</p>
          <p className="text-[11px] text-zinc-500">When your team members submit bonus challenges, they will appear here for review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChallenges.map((c) => {
            const isActing = actionLoading === c.id;
            return (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{c.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        c.difficulty === 'Easy'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : c.difficulty === 'Medium'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {c.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300">
                      {c.category}
                    </span>

                    {/* Status Badge */}
                    {c.status === 'PENDING_ORG' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        ⏳ Awaiting Team Review
                      </span>
                    )}
                    {c.status === 'ORG_APPROVED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        🏢 Shared With Team • Pending Global Admin
                      </span>
                    )}
                    {c.status === 'APPROVED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        🌐 Published Globally
                      </span>
                    )}
                    {c.status === 'REJECTED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                        ✕ Rejected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">{c.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                    <span>Author: <strong className="text-zinc-300 font-normal">{c.authorName || 'Team Member'}</strong></span>
                    <span>Submitted: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  {c.rejectionReason && (
                    <div className="mt-2 p-2 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-300">
                      <strong>Rejection note:</strong> {c.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/challenge/${c.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
                  >
                    Preview
                  </Link>

                  {c.status === 'PENDING_ORG' && (
                    <>
                      <button
                        onClick={() => handleApprove(c.id)}
                        disabled={isActing}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50 flex items-center gap-1 shadow-sm"
                      >
                        {isActing ? 'Saving...' : '✓ Approve for Team'}
                      </button>
                      <button
                        onClick={() => setRejectingId(c.id)}
                        disabled={isActing}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reject Team Challenge</h3>
            <p className="text-xs text-zinc-400">
              Provide constructive feedback to the author explaining why this challenge wasn&apos;t approved or what adjustments are needed.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please add more edge cases to the examples and clarify constraints..."
              rows={4}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason('');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectingId}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-sm disabled:opacity-50"
              >
                {actionLoading === rejectingId ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
