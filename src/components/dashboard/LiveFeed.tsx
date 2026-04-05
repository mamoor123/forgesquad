'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PipelineSignal } from '@/lib/signals';
import { AGENTS } from '@/lib/agents';
import clsx from 'clsx';

interface LiveFeedProps {
  events: PipelineSignal[];
}

export default function LiveFeed({ events }: LiveFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm font-mono">
        Waiting for pipeline events...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto pr-2 space-y-0.5" role="log" aria-live="polite" aria-label="Pipeline event feed">
      <AnimatePresence initial={false}>
        {events.map((event, i) => {
          const agent = AGENTS[event.agent];
          if (!agent) return null;

          const time = new Date(event.timestamp).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          const isSignal = event.type === 'phase_start' || event.type === 'phase_complete' || event.type === 'plan_locked' || event.type === 'pipeline_reset';
          const isFile = event.type === 'file_written';
          const isTest = event.type === 'test_result';

          return (
            <motion.div
              key={`${event.timestamp}-${i}`}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'flex items-start gap-2 py-1 px-2 rounded text-xs font-mono',
                isSignal && 'bg-[#111827] border border-[#1e2740]'
              )}
            >
              {/* Timestamp */}
              <span className="text-gray-600 shrink-0 select-none">{time}</span>

              {/* Agent badge */}
              <span
                className="shrink-0 font-medium px-1.5 rounded"
                style={{ color: agent.color, backgroundColor: `${agent.color}15` }}
              >
                {agent.name}
              </span>

              {/* Content */}
              <span className="text-gray-300 break-all">
                {isFile && (
                  <span className="text-violet-400">
                    📄 {event.payload.path}
                    <span className="text-gray-500"> ({event.payload.lines} lines)</span>
                  </span>
                )}
                {isTest && (
                  <span className={event.payload.failed > 0 ? 'text-rose-400' : 'text-green-400'}>
                    {event.payload.failed > 0 ? '✗' : '✓'} {event.payload.passed} passed
                    {event.payload.failed > 0 && `, ${event.payload.failed} failed`}
                  </span>
                )}
                {isSignal && (
                  <span className="text-cyan-400">
                    ▸ {formatSignalType(event.type)}: {event.payload.phase || event.type}
                  </span>
                )}
                {event.type === 'agent_message' && event.payload.message}
                {event.type === 'agent_question' && (
                  <span className="text-amber-400">❓ {event.payload.question}</span>
                )}
                {event.type === 'agent_answer' && (
                  <span className="text-emerald-400">→ {event.payload.answer}</span>
                )}
                {event.type === 'error' && (
                  <span className="text-rose-400">⚠ {event.payload.message || event.payload.error}</span>
                )}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function formatSignalType(type: string): string {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
