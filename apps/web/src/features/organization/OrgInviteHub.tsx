'use client';

import React, { useState } from 'react';
import { OrganizationInvite } from '@shared/types';
import { organizationService } from '../../services/organization.service';

interface OrgInviteHubProps {
  invites: OrganizationInvite[];
  onInvitesChanged: () => void;
}

export function OrgInviteHub({ invites, onInvitesChanged }: OrgInviteHubProps) {
  const [creating, setCreating] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [expiresInDays, setExpiresInDays] = useState<number>(30);
  const [emailTarget, setEmailTarget] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');

  const activeInvite = invites.find((i) => i.isActive);

  const getFullInviteUrl = (token: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/register?invite=${token}`;
    }
    return `/register?invite=${token}`;
  };

  const copyToClipboard = (token: string) => {
    const url = getFullInviteUrl(token);
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await organizationService.createInvite({
        email: emailTarget.trim() || undefined,
        expiresInDays: expiresInDays > 0 ? expiresInDays : undefined,
      });
      setShowCreateModal(false);
      setEmailTarget('');
      onInvitesChanged();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create invite link');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (inviteId: string) => {
    if (
      !confirm(
        'Are you sure you want to revoke this invitation link? Anyone with this link will no longer be able to join.'
      )
    ) {
      return;
    }
    try {
      await organizationService.revokeInvite(inviteId);
      onInvitesChanged();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to revoke invite');
    }
  };

  return (
    <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="font-display text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Team Invitation Hub</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Share this link with developers or team members to automatically attach them to your organization roster.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all self-start sm:self-auto shadow-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Generate New Link</span>
        </button>
      </div>

      {activeInvite ? (
        <div className="bg-zinc-50 dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">Active Join Link</span>
              {activeInvite.expiresAt && (
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  • Expires {new Date(activeInvite.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 truncate bg-white dark:bg-[#14161b] px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 select-all">
              {getFullInviteUrl(activeInvite.token)}
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
              <span className="tabular-nums">{activeInvite.usedCount} members joined</span>
              <span>• Created on {new Date(activeInvite.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(activeInvite.token)}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all flex items-center gap-1.5 shadow-xs"
            >
              {copiedToken === activeInvite.token ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleRevoke(activeInvite.id)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              Revoke
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md space-y-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">No active invitation links currently active.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Create an Invite Link
          </button>
        </div>
      )}

      {/* Create Invite Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="font-display text-sm font-bold text-zinc-900 dark:text-white">Generate Organization Invite Link</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-[var(--badge-hard-bg)] border border-[var(--badge-hard-border)] rounded-md text-xs text-[var(--badge-hard-text)] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateInvite} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Email (Optional)
                </label>
                <input
                  type="email"
                  value={emailTarget}
                  onChange={(e) => setEmailTarget(e.target.value)}
                  placeholder="colleague@company.com (Leave blank for shareable team link)"
                  className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                />
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  If left blank, any team member with this link can join.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Link Validity (Days)
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
                >
                  <option value={7}>7 Days</option>
                  <option value={14}>14 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days</option>
                  <option value={0}>Permanent (Until Revoked)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 shadow-xs"
                >
                  {creating ? 'Generating...' : 'Create Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
