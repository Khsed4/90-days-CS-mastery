'use client';

import React from 'react';
import { OrganizationMember } from '@shared/types';
import { TOTAL_ROADMAP_DAYS } from '@shared/constants';

interface OrgMembersTableProps {
  members: OrganizationMember[];
  loading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onViewProgress: (member: OrganizationMember) => void;
  onRemoveMember: (member: OrganizationMember) => void;
}

export function OrgMembersTable({
  members,
  loading,
  search,
  onSearchChange,
  onViewProgress,
  onRemoveMember,
}: OrgMembersTableProps) {
  return (
    <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Member Directory &amp; Progress Tracker</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Real-time curriculum velocity across all enrolled engineers and students.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full px-3 py-1.5 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 dark:text-zinc-400 font-mono animate-pulse">
          Loading team members...
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">No members found</p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Share your organization invite link to start onboarding team members.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-[#0c0d10] border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 min-w-[200px]">Roadmap Progress</th>
                <th className="py-3 px-4 text-center">Daily Streak</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 bg-white dark:bg-[#14161b]">
              {members.map((member) => {
                const percentage = Math.min(100, Math.round((member.completedDaysCount / TOTAL_ROADMAP_DAYS) * 100));
                return (
                  <tr key={member.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900 dark:text-white">{member.name}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{member.email}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 tabular-nums">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">
                            {member.completedDaysCount} <span className="text-zinc-400 font-normal">/ 90 Days</span>
                          </span>
                          <span className="text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">{percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/80 dark:border-zinc-700/80">
                          <div
                            className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {member.streak > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                          🔥 {member.streak}d
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onViewProgress(member)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        >
                          View Breakdown
                        </button>
                        <button
                          onClick={() => onRemoveMember(member)}
                          className="px-2 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
