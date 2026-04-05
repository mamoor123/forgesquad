'use client';

import { motion } from 'framer-motion';
import { PHASES, PHASE_LABELS, PHASE_COLORS, getPhaseIndex } from '@/lib/pipeline';
import { PipelinePhase } from '@/lib/signals';

interface PhaseTrackerProps {
  phase: PipelinePhase;
}

export default function PhaseTracker({ phase }: PhaseTrackerProps) {
  const currentIdx = getPhaseIndex(phase);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1">
        {PHASES.map((p, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          const color = PHASE_COLORS[p];

          return (
            <div key={p} className="flex items-center flex-1">
              {/* Phase node */}
              <div className="flex flex-col items-center relative">
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 relative z-10"
                  style={{
                    borderColor: isPast || isCurrent ? color : '#2a3655',
                    backgroundColor: isPast ? color : isCurrent ? `${color}30` : '#111827',
                    color: isPast ? '#0a0e1a' : isCurrent ? color : '#64748b',
                    boxShadow: isCurrent ? `0 0 15px ${color}40` : 'none',
                  }}
                  animate={
                    isCurrent
                      ? {
                          boxShadow: [
                            `0 0 5px ${color}20`,
                            `0 0 20px ${color}40`,
                            `0 0 5px ${color}20`,
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isPast ? '✓' : i + 1}
                </motion.div>

                {/* Label */}
                <span
                  className="mt-1.5 text-xs font-mono whitespace-nowrap"
                  style={{ color: isPast || isCurrent ? color : '#64748b' }}
                >
                  {PHASE_LABELS[p]}
                </span>
              </div>

              {/* Connector line */}
              {i < PHASES.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 relative -mt-4">
                  {/* Background line */}
                  <div className="absolute inset-0 bg-[#1e2740] rounded" />
                  {/* Progress line */}
                  {isPast && (
                    <motion.div
                      className="absolute inset-0 rounded"
                      style={{ backgroundColor: color }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded origin-left"
                      style={{ backgroundColor: color }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 0.5 }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar below */}
      <div className="mt-3 h-1 bg-[#1e2740] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full pipeline-glow"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentIdx / (PHASES.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
