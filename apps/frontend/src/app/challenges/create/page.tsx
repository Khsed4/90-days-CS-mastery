'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { challengeService } from '../../../services/challenge.service';
import { AuthBarrierModal } from '../../../components/auth/AuthBarrierModal';
import { DifficultyLevel, CreateChallengeDto } from '@shared';

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
      const payload: CreateChallengeDto = {
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
      setError(err.response?.data?.message || 'Failed to submit challenge. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#090d16' }}>
      <Header />

      <main style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '3px 10px', borderRadius: '999px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            <span>✍️</span> Creator Studio
          </div>
          <h1 style={{ margin: '0 0 0.4rem 0', fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
            Submit a Community Challenge
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            Share an insightful algorithmic puzzle with the community. Once reviewed by an administrator, your challenge will be published for everyone!
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Row 1: Title, Difficulty, Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Challenge Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Longest Substring Without Repeating Characters"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.7rem 0.9rem',
                  color: 'white',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.7rem 0.9rem',
                  color: 'white',
                  outline: 'none',
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Category *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Sliding Window & Hash Sets"
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.7rem 0.9rem',
                  color: 'white',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Prerequisite & Concepts */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
              💡 Concept & Theoretical Prerequisite (Explain how and why the optimal approach works) *
            </label>
            <textarea
              required
              value={prerequisite}
              onChange={(e) => setPrerequisite(e.target.value)}
              placeholder="Concept: Sliding Window Technique&#10;Explain the Big-O time and space complexity, data structures used, and the algorithmic pattern."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                color: 'white',
                outline: 'none',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
              📝 Problem Statement (Clear description of input, logic, and expected output) *
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Given a string `s`, find the length of the longest substring without repeating characters."
              rows={4}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                color: 'white',
                outline: 'none',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Examples & Constraints */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Test Examples (Input / Output / Explanation) *
              </label>
              <textarea
                required
                value={examples}
                onChange={(e) => setExamples(e.target.value)}
                placeholder="Input: s = 'abcabcbb'&#10;Output: 3&#10;Explanation: The answer is 'abc', with the length of 3."
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Constraints & Edge Cases *
              </label>
              <textarea
                required
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="- 0 <= s.length <= 5 * 10^4&#10;- s consists of English letters, digits, symbols and spaces."
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: 'white',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          {/* Solutions: Java & TypeScript */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Java Solution Code *
              </label>
              <textarea
                required
                value={java}
                onChange={(e) => setJava(e.target.value)}
                placeholder="public class Solution { ... }"
                rows={6}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#38bdf8',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.4rem' }}>
                TypeScript Solution Code *
              </label>
              <textarea
                required
                value={ts}
                onChange={(e) => setTs(e.target.value)}
                placeholder="function lengthOfLongestSubstring(s: string): number { ... }"
                rows={6}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  color: '#38bdf8',
                  outline: 'none',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              />
            </div>
          </div>

          {/* Submit Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: '700' }}
            >
              {loading ? 'Submitting Challenge...' : '🚀 Submit for Review'}
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
