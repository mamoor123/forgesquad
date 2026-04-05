// Pipeline phase management

import { PipelinePhase, AgentId } from './signals';

export const PHASES: PipelinePhase[] = ['concept', 'planning', 'reviewing', 'coding', 'testing', 'done'];

export const PHASE_LABELS: Record<PipelinePhase, string> = {
  idle: 'Idle',
  concept: 'Concept',
  planning: 'Plan',
  reviewing: 'Review',
  coding: 'Code',
  testing: 'Test',
  done: 'Done',
};

export const PHASE_COLORS: Record<PipelinePhase, string> = {
  idle: '#64748b',
  concept: '#00d4ff',
  planning: '#10b981',
  reviewing: '#f59e0b',
  coding: '#8b5cf6',
  testing: '#f43f5e',
  done: '#22c55e',
};

export const PHASE_AGENTS: Record<PipelinePhase, AgentId> = {
  idle: 'S',
  concept: 'S',
  planning: 'A',
  reviewing: 'B',
  coding: 'C',
  testing: 'D',
  done: 'S',
};

export function getNextPhase(phase: PipelinePhase): PipelinePhase | null {
  const idx = PHASES.indexOf(phase);
  if (idx < 0 || idx >= PHASES.length - 1) return null;
  return PHASES[idx + 1];
}

export function getPhaseProgress(phase: PipelinePhase): number {
  const idx = PHASES.indexOf(phase);
  if (idx < 0) return 0;
  return Math.round((idx / (PHASES.length - 1)) * 100);
}

export function getPhaseIndex(phase: PipelinePhase): number {
  return PHASES.indexOf(phase);
}
