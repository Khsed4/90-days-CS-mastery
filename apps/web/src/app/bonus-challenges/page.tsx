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
    if (c.status !== 'APPROVED') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.authorName && c.authorName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-800';
      case 'medium':
        return 'bg-amber-950/60 text-amber-400 border-amber-800';
      case 'hard':
        return 'bg-rose-950/60 text-rose-400 border-rose-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'PENDING':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'REJECTED':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8 flex-1">
        {/* Header Hero Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950 text-blue-400 border border-blue-800">
              <span>★</span> Community Challenges
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Community Bonus Challenges
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Expand your CS mastery beyond the 90-day core curriculum. Solve peer-contributed challenges, or author and submit your own algorithmic problems for review!
            </p>
          </div>

          <Link
            href="/challenges/create"
            className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0 shadow-sm"
          >
            <i className="fa-solid fa-plus mr-1.5"></i>
            Submit Challenge
          </Link>
        </div>

        {/* User Submissions (if logged in & has submissions) */}
        {user && mySubmissions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h2 className="text-sm font-semibold text-white">
                My Submissions ({mySubmissions.length})
              </h2>
              <Link
                href="/challenges/create"
                className="text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                + New Challenge
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400">ID #{sub.id}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(
                          sub.status
                        )}`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white truncate">{sub.title}</h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{sub.description}</p>
                  </div>

                  {sub.status === 'REJECTED' && sub.rejectionReason && (
                    <div className="p-2.5 bg-rose-950/40 border border-rose-800/60 rounded text-xs text-rose-300">
                      <strong>Feedback:</strong> {sub.rejectionReason}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                    <span className="text-zinc-500">{sub.category}</span>
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-semibold text-white">Published Community Challenges</h2>
              <p className="text-xs text-zinc-400">Approved algorithmic problems created by community members.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500"></i>
              <input
                type="text"
                placeholder="Search bonus challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {fetching ? (
            <div className="p-12 text-center text-zinc-500">
              <i className="fa-solid fa-circle-notch fa-spin text-xl text-blue-500"></i>
            </div>
          ) : filteredBonus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBonus.map((c) => (
                <Link
                  key={c.id}
                  href={`/challenge/${c.id}`}
                  className="group p-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg flex flex-col justify-between space-y-3 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-400">Bonus #{c.id}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(
                          c.difficulty
                        )}`}
                      >
                        {c.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                      {c.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs text-zinc-500">
                    <span>{c.category}</span>
                    {c.authorName && (
                      <span className="text-blue-400 text-[11px]">by @{c.authorName}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-sm text-zinc-400 font-medium">No published bonus challenges found.</p>
              <p className="text-xs text-zinc-500 mt-1">Be the first to submit a bonus challenge!</p>
              <Link
                href="/challenges/create"
                className="mt-3 inline-block px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500"
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
