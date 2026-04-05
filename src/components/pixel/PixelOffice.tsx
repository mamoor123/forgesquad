'use client';

import { motion } from 'framer-motion';
import AgentSprite from './AgentSprite';
import { Monitor, ServerRack, ConnectionLine } from './OfficeProps';
import { PipelinePhase } from '@/lib/signals';

interface PixelOfficeProps {
  activeAgent: string | null;
  phase: PipelinePhase;
}

const AGENTS = [
  { id: 'S' as const, name: 'Supervisor', color: '#00d4ff', x: 0, y: 0 },
  { id: 'A' as const, name: 'Planner', color: '#10b981', x: 1, y: 0 },
  { id: 'B' as const, name: 'Reviewer', color: '#f59e0b', x: 2, y: 0 },
  { id: 'C' as const, name: 'Coder', color: '#8b5cf6', x: 1, y: 1 },
  { id: 'D' as const, name: 'Tester', color: '#f43f5e', x: 2, y: 1 },
];

export default function PixelOffice({ activeAgent, phase }: PixelOfficeProps) {
  const isActive = (id: string) => activeAgent === id;
  const isOnline = phase !== 'idle';

  return (
    <div className="relative w-full h-full min-h-[200px] bg-[#060912] rounded-xl border border-[#1e2740] overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Server rack on the left */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <ServerRack active={isOnline} />
      </div>

      {/* Agent stations */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: 320, height: 160 }}>
          {/* Supervisor - top center */}
          <div
            className="absolute flex flex-col items-center gap-2"
            style={{ left: 130, top: 0 }}
          >
            <AgentSprite agent="S" active={isActive('S')} size="lg" />
            <span
              className="text-xs font-mono font-medium"
              style={{ color: isActive('S') ? '#00d4ff' : '#64748b' }}
            >
              Supervisor
            </span>
          </div>

          {/* Connection from S to A */}
          <div className="absolute" style={{ left: 110, top: 70 }}>
            <ConnectionLine from="S" to="A" color="#00d4ff" active={isActive('S') || isActive('A')} />
          </div>
          <div className="absolute" style={{ left: 180, top: 70 }}>
            <ConnectionLine from="S" to="B" color="#00d4ff" active={isActive('S') || isActive('B')} />
          </div>

          {/* Row 1: Planner, Reviewer */}
          <div
            className="absolute flex flex-col items-center gap-2"
            style={{ left: 50, top: 80 }}
          >
            <AgentSprite agent="A" active={isActive('A')} size="md" />
            <div className="flex flex-col items-center gap-1">
              <Monitor color="#10b981" active={isActive('A')} />
              <span
                className="text-xs font-mono font-medium"
                style={{ color: isActive('A') ? '#10b981' : '#64748b' }}
              >
                Planner
              </span>
            </div>
          </div>

          <div
            className="absolute flex flex-col items-center gap-2"
            style={{ left: 220, top: 80 }}
          >
            <AgentSprite agent="B" active={isActive('B')} size="md" />
            <div className="flex flex-col items-center gap-1">
              <Monitor color="#f59e0b" active={isActive('B')} />
              <span
                className="text-xs font-mono font-medium"
                style={{ color: isActive('B') ? '#f59e0b' : '#64748b' }}
              >
                Reviewer
              </span>
            </div>
          </div>

          {/* Connections between rows */}
          <div className="absolute" style={{ left: 110, top: 110 }}>
            <ConnectionLine from="A" to="C" color="#10b981" active={isActive('A') || isActive('C')} />
          </div>
          <div className="absolute" style={{ left: 180, top: 110 }}>
            <ConnectionLine from="B" to="D" color="#f59e0b" active={isActive('B') || isActive('D')} />
          </div>

          {/* Row 2: Coder, Tester */}
          <div
            className="absolute flex flex-col items-center gap-2"
            style={{ left: 50, top: 140 }}
          >
            <AgentSprite agent="C" active={isActive('C')} size="md" />
            <div className="flex flex-col items-center gap-1">
              <Monitor color="#8b5cf6" active={isActive('C')} />
              <span
                className="text-xs font-mono font-medium"
                style={{ color: isActive('C') ? '#8b5cf6' : '#64748b' }}
              >
                Coder
              </span>
            </div>
          </div>

          <div
            className="absolute flex flex-col items-center gap-2"
            style={{ left: 220, top: 140 }}
          >
            <AgentSprite agent="D" active={isActive('D')} size="md" />
            <div className="flex flex-col items-center gap-1">
              <Monitor color="#f43f5e" active={isActive('D')} />
              <span
                className="text-xs font-mono font-medium"
                style={{ color: isActive('D') ? '#f43f5e' : '#64748b' }}
              >
                Tester
              </span>
            </div>
          </div>

          {/* Bidirectional C-D connection */}
          <div className="absolute" style={{ left: 130, top: 170 }}>
            <ConnectionLine from="C" to="D" color="#8b5cf6" active={isActive('C') || isActive('D')} />
          </div>
        </div>
      </div>

      {/* Phase indicator */}
      {phase !== 'idle' && (
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-mono font-medium border"
          style={{
            backgroundColor: `${getPhaseColor(phase)}15`,
            borderColor: `${getPhaseColor(phase)}40`,
            color: getPhaseColor(phase),
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Phase: {phase.toUpperCase()}
        </motion.div>
      )}
    </div>
  );
}

function getPhaseColor(phase: PipelinePhase): string {
  const colors: Record<PipelinePhase, string> = {
    idle: '#64748b',
    concept: '#00d4ff',
    planning: '#10b981',
    reviewing: '#f59e0b',
    coding: '#8b5cf6',
    testing: '#f43f5e',
    done: '#22c55e',
  };
  return colors[phase];
}
