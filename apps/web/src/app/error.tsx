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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center text-2xl mx-auto">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Something went wrong</h2>
        <p className="text-xs text-zinc-400">
          An unexpected error occurred while loading this page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-md text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Go to Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
