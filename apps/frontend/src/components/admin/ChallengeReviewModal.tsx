'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Challenge } from '@shared';

interface ChallengeReviewModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number, reason: string) => Promise<void>;
}

export const ChallengeReviewModal: React.FC<ChallengeReviewModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [selectedLang, setSelectedLang] = useState<'java' | 'ts'>('java');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!challenge) return null;

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await onApprove(challenge.id);
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setProcessing(true);
    try {
      await onReject(challenge.id, rejectionReason.trim());
      setShowRejectInput(false);
      setRejectionReason('');
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Review Submission: ${challenge.title}`} maxWidth="750px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Metadata Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Submitted by: </span>
            <strong style={{ color: '#38bdf8' }}>{challenge.authorName || 'Community Member'}</strong>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className={`badge ${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{challenge.category}</span>
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.9rem', color: '#818cf8' }}>
            💡 Concept & Prerequisites
          </h4>
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              whiteSpace: 'pre-line',
            }}
          >
            {challenge.prerequisite}
          </div>
        </div>

        {/* Problem Statement */}
        <div>
          <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.9rem', color: '#f8fafc' }}>
            📝 Problem Description
          </h4>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            {challenge.description}
          </p>
        </div>

        {/* Examples & Constraints */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Test Examples
            </h4>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-line',
                color: '#e2e8f0',
              }}
            >
              {challenge.examples}
            </div>
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Constraints
            </h4>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-line',
                color: '#e2e8f0',
              }}
            >
              {challenge.constraints}
            </div>
          </div>
        </div>

        {/* Reference Solution Code */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#f8fafc' }}>
              💻 Reference Solution Code
            </h4>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setSelectedLang('java')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedLang === 'java' ? '#6366f1' : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Java
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('ts')}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedLang === 'ts' ? '#6366f1' : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                TypeScript
              </button>
            </div>
          </div>
          <pre
            style={{
              margin: 0,
              background: 'rgba(10, 15, 30, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '1rem',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              color: '#38bdf8',
              maxHeight: '220px',
              overflowY: 'auto',
            }}
          >
            <code>{selectedLang === 'java' ? challenge.java : challenge.ts}</code>
          </pre>
        </div>

        {/* Rejection Feedback Input */}
        {showRejectInput && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '1rem',
            }}
          >
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#f87171', marginBottom: '0.4rem' }}>
              Reason for Rejection / Revision Notes:
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please add boundary constraints and improve code comments."
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '0.6rem',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="btn btn-primary"
                style={{
                  background: 'rgba(239, 68, 68, 0.8)',
                  borderColor: '#ef4444',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                }}
              >
                {processing ? 'Submitting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showRejectInput && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowRejectInput(true)}
              className="btn btn-outline"
              style={{
                borderColor: 'rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
              }}
            >
              <i className="fa-solid fa-xmark"></i> Reject Submission
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={processing}
              className="btn btn-primary"
              style={{
                background: 'rgba(34, 197, 94, 0.85)',
                borderColor: '#22c55e',
                color: '#ffffff',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: '700',
              }}
            >
              <i className="fa-solid fa-check"></i> {processing ? 'Publishing...' : 'Approve & Publish Globally'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
