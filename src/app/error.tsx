'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a0e1a] text-white">
      <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-600/30 flex items-center justify-center mb-6">
        <span className="text-rose-400 text-2xl">⚠</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-gray-500 font-mono text-sm mb-8 max-w-md text-center">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-600/30 rounded-lg text-rose-400 font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
