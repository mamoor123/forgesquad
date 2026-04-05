'use client';

import { Play, Square, RotateCcw, SkipForward, Eye, Zap, FileSearch } from 'lucide-react';
import Button from '@/components/shared/Button';
import { PipelinePhase } from '@/lib/signals';

interface ControlBarProps {
  status: 'idle' | 'running' | 'paused' | 'done' | 'error';
  phase: PipelinePhase;
  onStart: () => void;
  onStop: () => void;
  onContinue: () => void;
  onReset: () => void;
  onViewPlan: () => void;
}

export default function ControlBar({
  status,
  phase,
  onStart,
  onStop,
  onContinue,
  onReset,
  onViewPlan,
}: ControlBarProps) {
  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isDone = status === 'done';
  const canContinue = isPaused && phase !== 'idle';
  const canViewPlan = phase === 'reviewing' || phase === 'coding' || phase === 'testing' || isDone;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Full Build */}
      {isIdle && (
        <Button
          label="Full Build"
          onClick={onStart}
          variant="primary"
          icon={<Zap className="w-4 h-4" />}
        />
      )}

      {/* STOP */}
      {isRunning && (
        <Button
          label="Stop"
          onClick={onStop}
          variant="danger"
          icon={<Square className="w-4 h-4" />}
        />
      )}

      {/* CONTINUE */}
      {canContinue && (
        <Button
          label="Continue"
          onClick={onContinue}
          variant="primary"
          icon={<SkipForward className="w-4 h-4" />}
        />
      )}

      {/* View Plan */}
      {canViewPlan && (
        <Button
          label="View Plan"
          onClick={onViewPlan}
          variant="secondary"
          color="#00d4ff"
          icon={<FileSearch className="w-4 h-4" />}
        />
      )}

      {/* RESET - always available except when running */}
      {!isRunning && !isIdle && (
        <Button
          label="Reset"
          onClick={onReset}
          variant="ghost"
          icon={<RotateCcw className="w-4 h-4" />}
        />
      )}
    </div>
  );
}
