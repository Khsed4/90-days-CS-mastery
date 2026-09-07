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
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>👥</span> Member Directory & Progress Tracker
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time curriculum velocity across all enrolled engineers and students.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search member by name or email..."
            className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-500 animate-pulse">
          Loading team members...
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl space-y-2">
          <div className="text-2xl">👥</div>
          <p className="text-xs font-semibold text-zinc-300">No members found</p>
          <p className="text-[11px] text-zinc-500">
            Share your organization invite link to start onboarding team members.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 min-w-[200px]">Roadmap Progress</th>
                <th className="py-3 px-4 text-center">Daily Streak</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/50">
              {members.map((member) => {
                const percentage = Math.min(100, Math.round((member.completedDaysCount / TOTAL_ROADMAP_DAYS) * 100));
                return (
                  <tr key={member.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{member.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{member.email}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-zinc-200">
                            {member.completedDaysCount} <span className="text-zinc-500 font-normal">/ 90 Days</span>
                          </span>
                          <span className="text-blue-400 font-medium">{percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/80">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {member.streak > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-800 text-[11px] font-bold text-amber-400">
                          🔥 {member.streak}d
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onViewProgress(member)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800 hover:bg-blue-900/50 transition-colors"
                        >
                          View Breakdown
                        </button>
                        <button
                          onClick={() => onRemoveMember(member)}
                          className="px-2 py-1 rounded-md text-[11px] font-medium text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
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
