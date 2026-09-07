'use client';

import React from 'react';
import { OrganizationStats } from '@shared/types';

interface OrgStatsBannerProps {
  stats: OrganizationStats;
  orgName: string;
}

export function OrgStatsBanner({ stats, orgName }: OrgStatsBannerProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-[11px] font-semibold text-purple-300 mb-1">
            <span>🏢</span> Organization Management Console
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{orgName}</h1>
          <p className="text-xs text-zinc-400">
            Monitor team developer growth, track 90-day curriculum velocity, and manage organization roster.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-medium">Team Members</span>
            <span className="text-base">👥</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Enrolled learners</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-medium">Avg. Days Completed</span>
            <span className="text-base">📊</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.avgCompletedDays} <span className="text-xs font-normal text-zinc-500">/ 90</span></div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Team average progress</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-medium">Active Streaks</span>
            <span className="text-base">🔥</span>
          </div>
          <div className="text-2xl font-bold text-amber-400">{stats.totalActiveStreaks}</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Developers coding daily</p>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-medium">Curriculum Completion</span>
            <span className="text-base">🏆</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.overallCompletionRate}%</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Total team syllabus coverage</p>
        </div>
      </div>
    </div>
  );
}
