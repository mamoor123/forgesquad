'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, AlertTriangle } from 'lucide-react';

interface StatsBarProps {
  startTime: number | null;
  fileCount: number;
  errorCount: number;
  status: string;
}

export default function StatsBar({ startTime, fileCount, errorCount, status }: StatsBarProps) {
  const [elapsed, setElapsed] = React.useState('00:00');

  React.useEffect(() => {
    if (!startTime) {
      setElapsed('00:00');
      return;
    }

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setElapsed(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const statusColor =
    status === 'running'
      ? '#10b981'
      : status === 'done'
      ? '#22c55e'
      : status === 'error'
      ? '#f43f5e'
      : status === 'paused'
      ? '#f59e0b'
      : '#64748b';

  return (
    <div className="flex items-center gap-6">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: statusColor }}
          animate={status === 'running' ? { opacity: [1, 0.4, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span
          className="text-xs font-mono uppercase tracking-widest"
          style={{ color: statusColor }}
        >
          {status}
        </span>
      </div>

      {/* Elapsed time */}
      <div className="flex items-center gap-1.5 text-gray-400">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-xs font-mono">{elapsed}</span>
      </div>

      {/* File count */}
      <div className="flex items-center gap-1.5 text-gray-400">
        <FileText className="w-3.5 h-3.5" />
        <span className="text-xs font-mono">{fileCount} files</span>
      </div>

      {/* Error count */}
      <div className="flex items-center gap-1.5">
        <AlertTriangle
          className="w-3.5 h-3.5"
          style={{ color: errorCount > 0 ? '#f43f5e' : '#64748b' }}
        />
        <span
          className="text-xs font-mono"
          style={{ color: errorCount > 0 ? '#f43f5e' : '#64748b' }}
        >
          {errorCount} errors
        </span>
      </div>
    </div>
  );
}
