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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{member.name}</h3>
              <span className="text-xs text-zinc-500 font-mono">({member.email})</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              90-Day Curriculum Breakdown • Joined {new Date(member.joinedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary Banner */}
          <div className="grid grid-cols-3 gap-3 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
            <div>
              <div className="text-xl font-bold text-blue-400">{completedSet.size} / 90</div>
              <div className="text-[11px] text-zinc-400">Days Completed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">{percentage}%</div>
              <div className="text-[11px] text-zinc-400">Total Progress</div>
            </div>
            <div>
              <div className="text-xl font-bold text-amber-400">🔥 {member.streak} Days</div>
              <div className="text-[11px] text-zinc-400">Current Streak</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-zinc-400 font-medium">
              <span>Curriculum Coverage</span>
              <span className="text-white font-bold">{percentage}% Completed</span>
            </div>
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* 90-Day Heatmap Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
              <span>90-Day Calendar Grid</span>
              <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-zinc-800 inline-block"></span> Incomplete
                </span>
              </div>
            </div>

            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1.5 p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl">
              {daysArray.map((dayNum) => {
                const isCompleted = completedSet.has(dayNum);
                return (
                  <div
                    key={dayNum}
                    title={`Day ${dayNum}: ${isCompleted ? 'Completed ✅' : 'Pending ⏳'}`}
                    className={`h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                        : 'bg-zinc-900 border border-zinc-800/60 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
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
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
