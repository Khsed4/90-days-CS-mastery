import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col items-center justify-center px-6">
      <div className="max-w-xs w-full space-y-6 text-center">
        <div className="font-mono text-5xl font-bold text-[var(--border-mid)] tracking-tighter">404</div>
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Page not found</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            This challenge or page doesn't exist or has moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold text-[var(--bg-canvas)] bg-[var(--text-primary)] hover:opacity-80 transition-opacity active:scale-95"
        >
          ← Back to roadmap
        </Link>
      </div>
    </div>
  );
}
