'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth';
import { Header } from '@/components/layout/Header';
import { challengeService } from '@/services/challenge.service';
import { Challenge } from '@shared/types';

export default function BonusChallengesPage() {
  const { user } = useAuth();

  const [bonusChallenges, setBonusChallenges] = useState<Challenge[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Challenge[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setFetching(true);
    try {
      const [bonusData, myData] = await Promise.all([
        challengeService.getBonusChallenges(),
        user ? challengeService.getMySubmissions() : Promise.resolve([]),
      ]);
      setBonusChallenges(bonusData);
      setMySubmissions(myData);
    } catch (err) {
      console.error('Failed to load bonus challenges:', err);
    } finally {
      setFetching(false);
    }
  };

  const filteredBonus = bonusChallenges.filter((c) => {
    if (c.status !== 'APPROVED' && c.status !== 'ORG_APPROVED') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.authorName && c.authorName.toLowerCase().includes(q)) ||
        (c.organizationName && c.organizationName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-[var(--badge-easy-bg)] text-[var(--badge-easy-text)] border-[var(--badge-easy-border)]';
      case 'medium':
        return 'bg-[var(--badge-medium-bg)] text-[var(--badge-medium-text)] border-[var(--badge-medium-border)]';
      case 'hard':
        return 'bg-[var(--badge-hard-bg)] text-[var(--badge-hard-text)] border-[var(--badge-hard-border)]';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'ORG_APPROVED':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'PENDING_ORG':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'PENDING':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'REJECTED':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Published Globally';
      case 'ORG_APPROVED':
        return 'Approved by Team';
      case 'PENDING_ORG':
        return 'Awaiting Team Approval';
      case 'PENDING':
        return 'Awaiting Admin Approval';
      case 'REJECTED':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col transition-colors">
      <Header />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8 flex-1">
        {/* Header Hero Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xs">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Community Challenges</span>
            </div>
            <h1 className="font-display text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Community Bonus Challenges
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Expand your CS mastery beyond the 90-day core curriculum. Solve peer-contributed challenges, or author and submit your own algorithmic problems for review.
            </p>
          </div>

          <Link
            href="/challenges/create"
            className="px-3.5 py-2 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Submit Challenge</span>
          </Link>
        </div>

        {/* User Submissions (if logged in & has submissions) */}
        {user && mySubmissions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h2 className="font-display text-sm font-semibold text-zinc-900 dark:text-white">
                My Submissions ({mySubmissions.length})
              </h2>
              <Link
                href="/challenges/create"
                className="text-xs font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:opacity-80"
              >
                + New Challenge
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-col justify-between space-y-3 shadow-2xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400 tabular-nums">#{sub.id}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(
                          sub.status
                        )}`}
                      >
                        {getStatusLabel(sub.status)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{sub.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{sub.description}</p>
                  </div>

                  {sub.status === 'REJECTED' && sub.rejectionReason && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-md text-xs text-rose-700 dark:text-rose-300">
                      <strong>Feedback:</strong> {sub.rejectionReason}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">{sub.category}</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getDifficultyBadge(
                        sub.difficulty
                      )}`}
                    >
                      {sub.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Community Challenges List */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="font-display text-base font-semibold text-zinc-900 dark:text-white">Published Community &amp; Team Challenges</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Algorithmic problems approved for team collaboration and global learning.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search bonus challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
          </div>

          {fetching ? (
            <div className="p-12 text-center text-xs text-zinc-500 font-mono animate-pulse">
              Loading bonus challenges...
            </div>
          ) : filteredBonus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBonus.map((c) => (
                <Link
                  key={c.id}
                  href={`/challenge/${c.id}`}
                  className="group p-4 bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-lg flex flex-col justify-between space-y-3 transition-all shadow-2xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono text-zinc-400 tabular-nums">#{c.id}</span>
                        {c.status === 'ORG_APPROVED' ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                            Team
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            Global
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(
                          c.difficulty
                        )}`}
                      >
                        {c.difficulty}
                      </span>
                    </div>

                    <h3 className="font-display text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white truncate">
                      {c.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500">
                    <span>{c.category}</span>
                    {c.authorName && (
                      <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">@{c.authorName}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-lg bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 space-y-2">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">No published bonus challenges found.</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Be the first to submit a bonus challenge!</p>
              <Link
                href="/challenges/create"
                className="mt-2 inline-block px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-all shadow-xs"
              >
                Submit a Challenge
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
