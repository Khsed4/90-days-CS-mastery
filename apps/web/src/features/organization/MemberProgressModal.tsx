'use client';

import React from 'react';
import { OrganizationMember } from '@shared/types';
import { TOTAL_ROADMAP_DAYS } from '@shared/constants';

interface MemberProgressModalProps {
  member: OrganizationMember | null;
  onClose: () => void;
}

export function MemberProgressModal({ member, onClose }: MemberProgressModalProps) {
  if (!member) return null;

  const completedSet = new Set(member.completedDaysList || []);
  const percentage = Math.min(100, Math.round((completedSet.size / TOTAL_ROADMAP_DAYS) * 100));

  // Render 90 days grid
  const daysArray = Array.from({ length: TOTAL_ROADMAP_DAYS }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">{member.name}</h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">({member.email})</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              90-Day Curriculum Breakdown • Joined {new Date(member.joinedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Summary Banner */}
          <div className="grid grid-cols-3 gap-3 bg-zinc-50 dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg text-center">
            <div>
              <div className="font-display text-xl font-bold text-zinc-900 dark:text-white tabular-nums">{completedSet.size} / 90</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Days Completed</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-zinc-900 dark:text-white tabular-nums">{percentage}%</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Total Progress</div>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{member.streak} Days</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Active Streak</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <span>Curriculum Coverage</span>
              <span className="text-zinc-900 dark:text-white font-bold tabular-nums">{percentage}% Completed</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
              <div
                className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* 90-Day Heatmap Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <span>90-Day Challenge Map</span>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 dark:bg-zinc-100 inline-block"></span> Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-zinc-200 dark:bg-zinc-800 inline-block border border-zinc-300 dark:border-zinc-700"></span> Incomplete
                </span>
              </div>
            </div>

            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 p-3 bg-zinc-50 dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-lg">
              {daysArray.map((dayNum) => {
                const isCompleted = completedSet.has(dayNum);
                return (
                  <div
                    key={dayNum}
                    title={`Day ${dayNum}: ${isCompleted ? 'Completed' : 'Pending'}`}
                    className={`h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      isCompleted
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                        : 'bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#0c0d10]/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
