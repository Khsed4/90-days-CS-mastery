'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled UI error:', error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6">
      <div className="max-w-xs w-full space-y-6 text-center">
        <div className="w-10 h-10 rounded-md border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Something went wrong</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            An unexpected error occurred. You can try reloading or return to the roadmap.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-md text-sm font-semibold text-[var(--bg-canvas)] bg-[var(--text-primary)] hover:opacity-80 transition-opacity active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-mid)] transition-colors"
          >
            Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
