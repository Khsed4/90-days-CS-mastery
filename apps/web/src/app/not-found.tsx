import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-2xl mx-auto">
          404
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">Page Not Found</h2>
        <p className="text-xs text-zinc-400">
          The challenge or page you are looking for does not exist or has been relocated.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
        >
          Return to Roadmap Hub
        </Link>
      </div>
    </div>
  );
}
