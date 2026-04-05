import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a0e1a] text-white">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center mb-6">
        <span className="text-white font-bold text-2xl">F</span>
      </div>
      <h1 className="text-6xl font-bold text-gray-800 font-mono mb-4">404</h1>
      <p className="text-gray-500 text-lg font-mono mb-8">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 rounded-lg text-cyan-400 font-medium transition-colors"
      >
        Back to ForgeSquad
      </Link>
    </div>
  );
}
