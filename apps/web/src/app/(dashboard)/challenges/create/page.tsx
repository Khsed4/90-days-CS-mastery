'use client';

import React, { useState } from 'react';
import { useAuth, AuthBarrierModal } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { challengeService } from '@/services/challenge.service';
import { DifficultyLevel } from '@shared/types';
import { CreateChallengeRequest } from '@shared/contracts';

export default function CreateChallengePage() {
  const { user, isGuest, authBarrier, openAuthBarrier, closeAuthBarrier } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [category, setCategory] = useState('');
  const [prerequisite, setPrerequisite] = useState('');
  const [description, setDescription] = useState('');
  const [examples, setExamples] = useState('');
  const [constraints, setConstraints] = useState('');
  const [java, setJava] = useState('');
  const [ts, setTs] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest || !user) {
      openAuthBarrier();
      return;
    }

    setError('');
    setLoading(true);

    try {
      const payload: CreateChallengeRequest = {
        title,
        difficulty,
        category,
        prerequisite,
        description,
        examples,
        constraints,
        java,
        ts,
        type: 'BONUS',
      };

      const created = await challengeService.createChallenge(payload);
      router.push(`/challenge/${created.id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Failed to submit challenge. Please verify all required fields.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <span>✍️</span> Creator Studio
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Submit a Community Challenge
          </h1>
          <p className="text-xs text-zinc-400">
            Share an algorithmic puzzle with the community. Once reviewed by an administrator, your challenge will be published.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-md text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-5 shadow-sm"
        >
          {/* Row 1: Title, Difficulty, Category */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Longest Substring Without Repeating Characters"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Category *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Sliding Window"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Prerequisite / Algorithmic Concept */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              💡 Theoretical Prerequisite & Time/Space Complexity *
            </label>
            <textarea
              required
              rows={3}
              value={prerequisite}
              onChange={(e) => setPrerequisite(e.target.value)}
              placeholder="Explain the optimal technique (e.g. Two Pointers, Dynamic Programming), Big-O complexities, and data structures."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          {/* Problem Statement */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-300">
              📝 Problem Statement *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Given an array of integers nums and an integer target..."
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          {/* Examples & Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Test Examples (Input / Output / Explanation) *
              </label>
              <textarea
                required
                rows={4}
                value={examples}
                onChange={(e) => setExamples(e.target.value)}
                placeholder="Input: nums = [2,7,11,15], target = 9&#10;Output: [0,1]"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Constraints & Edge Cases *
              </label>
              <textarea
                required
                rows={4}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="- 2 <= nums.length <= 10^4&#10;- -10^9 <= nums[i] <= 10^9"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Reference Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Java Solution Code *
              </label>
              <textarea
                required
                rows={6}
                value={java}
                onChange={(e) => setJava(e.target.value)}
                placeholder="public class Solution { ... }"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-blue-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                TypeScript Solution Code *
              </label>
              <textarea
                required
                rows={6}
                value={ts}
                onChange={(e) => setTs(e.target.value)}
                placeholder="function solve(nums: number[]): number[] { ... }"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-blue-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-md text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </main>

      <AuthBarrierModal
        isOpen={authBarrier.isOpen}
        onClose={closeAuthBarrier}
        onSuccess={() => {}}
      />
    </div>
  );
}
