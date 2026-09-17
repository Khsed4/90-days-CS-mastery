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
    <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white tracking-tight">Team Challenges Moderation</h2>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Review bonus challenges submitted by members of your organization. Approving a challenge shares it across your entire team and submits it for platform-wide publishing.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto bg-zinc-100 dark:bg-[#0c0d10] p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
          {(['ALL', 'PENDING_ORG', 'ORG_APPROVED', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
                filter === status
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
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
        <div className="py-12 text-center text-xs text-zinc-500 font-mono animate-pulse">Loading team challenges...</div>
      ) : filteredChallenges.length === 0 ? (
        <div className="py-12 text-center rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 space-y-2">
          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">No challenges found matching this filter.</p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">When your team members submit bonus challenges, they will appear here for review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredChallenges.map((c) => {
            const isActing = actionLoading === c.id;
            return (
              <div
                key={c.id}
                className="p-4 rounded-lg bg-zinc-50/70 dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{c.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        c.difficulty === 'Easy'
                          ? 'bg-[var(--badge-easy-bg)] text-[var(--badge-easy-text)] border-[var(--badge-easy-border)]'
                          : c.difficulty === 'Medium'
                          ? 'bg-[var(--badge-medium-bg)] text-[var(--badge-medium-text)] border-[var(--badge-medium-border)]'
                          : 'bg-[var(--badge-hard-bg)] text-[var(--badge-hard-text)] border-[var(--badge-hard-border)]'
                      }`}
                    >
                      {c.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {c.category}
                    </span>

                    {/* Status Badge */}
                    {c.status === 'PENDING_ORG' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        Awaiting Team Review
                      </span>
                    )}
                    {c.status === 'ORG_APPROVED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                        Shared With Team • Pending Global Admin
                      </span>
                    )}
                    {c.status === 'APPROVED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                        Published Globally
                      </span>
                    )}
                    {c.status === 'REJECTED' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                        Rejected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">{c.description}</p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-400 dark:text-zinc-500">
                    <span>Author: <strong className="text-zinc-700 dark:text-zinc-300 font-normal">{c.authorName || 'Team Member'}</strong></span>
                    <span className="tabular-nums">Submitted: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>

                  {c.rejectionReason && (
                    <div className="mt-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-md text-xs text-rose-700 dark:text-rose-300">
                      <strong>Rejection note:</strong> {c.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/challenge/${c.id}`}
                    className="px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                  >
                    Preview
                  </Link>

                  {c.status === 'PENDING_ORG' && (
                    <>
                      <button
                        onClick={() => handleApprove(c.id)}
                        disabled={isActing}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 shadow-xs"
                      >
                        {isActing ? 'Saving...' : 'Approve for Team'}
                      </button>
                      <button
                        onClick={() => setRejectingId(c.id)}
                        disabled={isActing}
                        className="px-3 py-1.5 rounded-md text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900 transition-colors disabled:opacity-50"
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
        <div className="fixed inset-0 bg-zinc-950/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">Reject Team Challenge</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Provide constructive feedback to the author explaining why this challenge wasn&apos;t approved or what adjustments are needed.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please add more edge cases to the examples and clarify constraints..."
              rows={4}
              className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectionReason('');
                }}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectingId}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-xs disabled:opacity-50"
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
