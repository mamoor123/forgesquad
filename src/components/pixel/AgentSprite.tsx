'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { AGENTS, Agent } from '@/lib/agents';

interface AgentSpriteProps {
  agent: Agent['id'];
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AGENT_INITIALS: Record<string, string> = {
  S: 'SP',
  A: 'PL',
  B: 'RV',
  C: 'CD',
  D: 'TS',
};

export default function AgentSprite({ agent, active = false, size = 'md' }: AgentSpriteProps) {
  const color = AGENTS[agent].color;
  const initials = AGENT_INITIALS[agent];

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Pulse ring */}
      {active && (
        <motion.div
          className="absolute rounded-full"
          style={{ border: `2px solid ${color}` }}
          initial={{ width: '100%', height: '100%', opacity: 0.8 }}
          animate={{ width: '150%', height: '150%', opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Agent circle */}
      <motion.div
        className={clsx(
          'rounded-full flex items-center justify-center font-mono font-bold relative z-10',
          sizeClasses[size]
        )}
        style={{
          backgroundColor: `${color}20`,
          border: `2px solid ${color}`,
          color: color,
          boxShadow: active ? `0 0 20px ${color}40` : 'none',
        }}
        animate={active ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {initials}
      </motion.div>
    </div>
  );
}
