'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Challenge, CreateChallengeDto, UpdateChallengeDto, DifficultyLevel, ChallengeType, ChallengeStatus } from '@shared';

interface ChallengeEditModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, data: CreateChallengeDto | UpdateChallengeDto) => Promise<void>;
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
      maxWidth="750px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Challenge Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Inverted Binary Tree"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
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
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ChallengeType)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: 'white',
                outline: 'none',
              }}
            >
              <option value="CORE">CORE (90 Days)</option>
              <option value="BONUS">BONUS</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Category
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Dynamic Programming"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ChallengeStatus)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: 'white',
                outline: 'none',
              }}
            >
              <option value="APPROVED">APPROVED (Published)</option>
              <option value="PENDING">PENDING (In Review)</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
            Concept & Prerequisites (Educational explanation)
          </label>
          <textarea
            required
            value={prerequisite}
            onChange={(e) => setPrerequisite(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.6rem 0.8rem',
              color: 'white',
              outline: 'none',
              fontSize: '0.85rem',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
            Problem Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.6rem 0.8rem',
              color: 'white',
              outline: 'none',
              fontSize: '0.85rem',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Examples
            </label>
            <textarea
              required
              value={examples}
              onChange={(e) => setExamples(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: 'white',
                outline: 'none',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Constraints
            </label>
            <textarea
              required
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: 'white',
                outline: 'none',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              Java Solution Code
            </label>
            <textarea
              required
              value={java}
              onChange={(e) => setJava(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: '#38bdf8',
                outline: 'none',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8', marginBottom: '0.35rem' }}>
              TypeScript Solution Code
            </label>
            <textarea
              required
              value={ts}
              onChange={(e) => setTs(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '0.6rem 0.8rem',
                color: '#38bdf8',
                outline: 'none',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', fontWeight: '700' }}
          >
            {saving ? 'Saving...' : isEditing ? 'Update Challenge' : 'Create Challenge'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
