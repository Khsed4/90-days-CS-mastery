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
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col transition-colors">
      <Header />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Creator Studio</span>
          </div>
          <h1 className="font-display text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Submit a Community Challenge
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Share an algorithmic puzzle with the community. Once reviewed by an administrator, your challenge will be published.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[var(--badge-hard-bg)] border border-[var(--badge-hard-border)] rounded-md text-xs text-[var(--badge-hard-text)] font-medium">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#14161b] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-5 shadow-xs"
        >
          {/* Row 1: Title, Difficulty, Category */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Longest Substring Without Repeating Characters"
                className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Category *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Sliding Window"
                className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Prerequisite / Algorithmic Concept */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Theoretical Prerequisite &amp; Complexity Analysis *
            </label>
            <textarea
              required
              rows={3}
              value={prerequisite}
              onChange={(e) => setPrerequisite(e.target.value)}
              placeholder="Explain the optimal technique (e.g. Two Pointers, Dynamic Programming), Big-O complexities, and data structures."
              className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          {/* Problem Statement */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Problem Statement *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Given an array of integers nums and an integer target..."
              className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
            />
          </div>

          {/* Examples & Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Test Examples (Input / Output / Explanation) *
              </label>
              <textarea
                required
                rows={4}
                value={examples}
                onChange={(e) => setExamples(e.target.value)}
                placeholder="Input: nums = [2,7,11,15], target = 9&#10;Output: [0,1]"
                className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Constraints &amp; Edge Cases *
              </label>
              <textarea
                required
                rows={4}
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="- 2 <= nums.length <= 10^4&#10;- -10^9 <= nums[i] <= 10^9"
                className="w-full px-3 py-2 bg-white dark:bg-[#0c0d10] border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Reference Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Java Solution Code *
              </label>
              <textarea
                required
                rows={6}
                value={java}
                onChange={(e) => setJava(e.target.value)}
                placeholder="public class Solution { ... }"
                className="w-full px-3 py-2 bg-[#0c0d10] border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                TypeScript Solution Code *
              </label>
              <textarea
                required
                rows={6}
                value={ts}
                onChange={(e) => setTs(e.target.value)}
                placeholder="function solve(nums: number[]): number[] { ... }"
                className="w-full px-3 py-2 bg-[#0c0d10] border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 active:scale-98 transition-all shadow-xs disabled:opacity-50"
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
