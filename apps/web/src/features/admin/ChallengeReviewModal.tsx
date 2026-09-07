'use client';

import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Challenge } from '@shared/types';

interface ChallengeReviewModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
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
      await onApprove();
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    setProcessing(true);
    try {
      await onReject(rejectionReason.trim());
      setShowRejectInput(false);
      setRejectionReason('');
      onClose();
    } finally {
      setProcessing(false);
    }
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Submission: ${challenge.title}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Meta Bar */}
        <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-md text-xs">
          <div>
            <span className="text-zinc-400">Author: </span>
            <strong className="text-white">@{challenge.authorName || 'Community Member'}</strong>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getDifficultyBadge(
                challenge.difficulty
              )}`}
            >
              {challenge.difficulty}
            </span>
            <span className="text-zinc-400">{challenge.category}</span>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
            💡 Concept & Prerequisites
          </h4>
          <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-md text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
            {challenge.prerequisite}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            📝 Problem Description
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
            {challenge.description}
          </p>
        </div>

        {/* Examples & Constraints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Test Examples
            </h4>
            <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {challenge.examples}
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Constraints
            </h4>
            <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
              {challenge.constraints}
            </div>
          </div>
        </div>

        {/* Solution Code */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Solution Code
            </h4>
            <div className="flex gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedLang('java')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  selectedLang === 'java' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
              >
                Java
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('ts')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  selectedLang === 'ts' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
              >
                TypeScript
              </button>
            </div>
          </div>
          <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-blue-300 overflow-x-auto max-h-44">
            <code>{selectedLang === 'java' ? challenge.java : challenge.ts}</code>
          </pre>
        </div>

        {/* Rejection Feedback Box */}
        {showRejectInput && (
          <div className="p-3 bg-rose-950/30 border border-rose-800 rounded-md space-y-2">
            <label className="block text-xs font-semibold text-rose-300">
              Reason for Rejection / Revision Notes:
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please clarify edge case constraints and optimize the reference solution."
              rows={2}
              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-rose-700"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                className="px-2.5 py-1 rounded text-xs text-zinc-300 bg-zinc-800 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                className="px-3 py-1 rounded text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50"
              >
                {processing ? 'Submitting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        {!showRejectInput && (
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRejectInput(true)}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-800/80 hover:bg-rose-900/60 transition-colors"
            >
              Reject Submission
            </button>
            <button
              type="button"
              onClick={handleApprove}
              disabled={processing}
              className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm disabled:opacity-50"
            >
              {processing ? 'Publishing...' : 'Approve & Publish Globally'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
