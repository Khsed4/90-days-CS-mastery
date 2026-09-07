'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Challenge, DifficultyLevel, ChallengeType, ChallengeStatus } from '@shared/types';
import { CreateChallengeRequest, UpdateChallengeRequest } from '@shared/contracts';

interface ChallengeEditModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: CreateChallengeRequest | UpdateChallengeRequest) => Promise<void>;
}

export const ChallengeEditModal: React.FC<ChallengeEditModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(challenge);

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [category, setCategory] = useState('');
  const [prerequisite, setPrerequisite] = useState('');
  const [description, setDescription] = useState('');
  const [examples, setExamples] = useState('');
  const [constraints, setConstraints] = useState('');
  const [java, setJava] = useState('');
  const [ts, setTs] = useState('');
  const [type, setType] = useState<ChallengeType>('BONUS');
  const [status, setStatus] = useState<ChallengeStatus>('APPROVED');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (challenge) {
      setTitle(challenge.title);
      setDifficulty(challenge.difficulty);
      setCategory(challenge.category);
      setPrerequisite(challenge.prerequisite);
      setDescription(challenge.description);
      setExamples(challenge.examples);
      setConstraints(challenge.constraints);
      setJava(challenge.java);
      setTs(challenge.ts);
      setType(challenge.type);
      setStatus(challenge.status);
    } else {
      setTitle('');
      setDifficulty('Medium');
      setCategory('Algorithms');
      setPrerequisite('');
      setDescription('');
      setExamples('');
      setConstraints('');
      setJava('');
      setTs('');
      setType('BONUS');
      setStatus('APPROVED');
    }
  }, [challenge, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        title,
        difficulty,
        category,
        prerequisite,
        description,
        examples,
        constraints,
        java,
        ts,
        type,
        status,
      };
      await onSave(challenge ? challenge.id : null, payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Challenge #${challenge?.id}` : 'Create New Challenge'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Challenge Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inverted Binary Tree"
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ChallengeType)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="CORE">CORE (90 Days)</option>
              <option value="BONUS">BONUS</option>
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Category
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Dynamic Programming"
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ChallengeStatus)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-medium text-zinc-200 focus:outline-none focus:border-zinc-700 cursor-pointer"
            >
              <option value="APPROVED">APPROVED (Published)</option>
              <option value="PENDING">PENDING (In Review)</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        {/* Prerequisite */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-300">
            Prerequisites & Theory
          </label>
          <textarea
            required
            rows={2}
            value={prerequisite}
            onChange={(e) => setPrerequisite(e.target.value)}
            className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-zinc-300">
            Problem Description
          </label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>

        {/* Examples & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Examples
            </label>
            <textarea
              required
              rows={3}
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Constraints
            </label>
            <textarea
              required
              rows={3}
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Solutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              Java Solution Code
            </label>
            <textarea
              required
              rows={4}
              value={java}
              onChange={(e) => setJava(e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-blue-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-300">
              TypeScript Solution Code
            </label>
            <textarea
              required
              rows={4}
              value={ts}
              onChange={(e) => setTs(e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-blue-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
