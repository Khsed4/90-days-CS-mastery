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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            <span>Organization Management Console</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{orgName}</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Monitor team developer growth, track 90-day curriculum velocity, and manage organization roster.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">Team Members</span>
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="font-display text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">{stats.totalMembers}</div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Enrolled learners</p>
        </div>

        <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">Avg. Days Completed</span>
            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="font-display text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
            {stats.avgCompletedDays} <span className="text-xs font-normal text-zinc-400 dark:text-zinc-500">/ 90</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Team average progress</p>
        </div>

        <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">Active Streaks</span>
            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.316.492-.474.966-.567 1.343a4.777 4.777 0 00-.275.983c-.04.205-.07.39-.089.524-.047-.037-.1-.082-.16-.134a6.605 6.605 0 00-.776-.567 1 1 0 00-1.494 1.157c.216.71.493 1.488.828 2.222.33 1.01.764 1.986 1.332 2.887.037.058.077.115.12.17.067.094.137.185.21.272.073.087.15.17.23.25.16.16.33.305.51.436.36.26.75.474 1.16.634.41.16.84.26 1.28.3a4.992 4.992 0 003.58-1.44c.94-.94 1.46-2.21 1.46-3.54 0-1.02-.31-1.99-.87-2.8a7.03 7.03 0 00-2.31-2.074c-.66-.38-1.39-.63-2.14-.74-.26-.04-.52-.06-.78-.06z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{stats.totalActiveStreaks}</div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Developers coding daily</p>
        </div>

        <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-xs font-medium">Curriculum Completion</span>
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{stats.overallCompletionRate}%</div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">Total team syllabus coverage</p>
        </div>
      </div>
    </div>
  );
}
