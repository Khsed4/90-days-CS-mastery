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
    if (!confirm('Are you sure you want to revoke this invitation link? Anyone with this link will no longer be able to join.')) {
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
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>🔗</span> Team Invitation Hub
          </h2>
          <p className="text-xs text-zinc-400">
            Share this link with developers, students, or team members to automatically attach them to your organization roster.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-sm self-start sm:self-auto"
        >
          <span>➕</span> Generate New Link
        </button>
      </div>

      {activeInvite ? (
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-400">Active Shareable Join Link</span>
              {activeInvite.expiresAt && (
                <span className="text-[11px] text-zinc-500">
                  • Expires {new Date(activeInvite.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="font-mono text-xs text-zinc-300 truncate bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800 select-all">
              {getFullInviteUrl(activeInvite.token)}
            </div>
            <div className="text-[11px] text-zinc-500 flex items-center gap-3">
              <span>👥 {activeInvite.usedCount} members joined</span>
              <span>• Created on {new Date(activeInvite.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(activeInvite.token)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>{copiedToken === activeInvite.token ? '✅' : '📋'}</span>
              <span>{copiedToken === activeInvite.token ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={() => handleRevoke(activeInvite.id)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-800 transition-colors"
            >
              Revoke
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl space-y-2">
          <p className="text-xs text-zinc-400">No active invitation links currently active.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-purple-400 bg-purple-950/60 border border-purple-800 hover:bg-purple-900/50 transition-colors"
          >
            Create an Invite Link
          </button>
        </div>
      )}

      {/* Create Invite Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white">Generate Organization Invite Link</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateInvite} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-300">
                  Target Email (Optional)
                </label>
                <input
                  type="email"
                  value={emailTarget}
                  onChange={(e) => setEmailTarget(e.target.value)}
                  placeholder="colleague@company.com (Leave blank for shareable team link)"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-zinc-500">
                  If left blank, any team member with this link can join.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-300">
                  Link Validity (Days)
                </label>
                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
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
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-sm disabled:opacity-50"
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
