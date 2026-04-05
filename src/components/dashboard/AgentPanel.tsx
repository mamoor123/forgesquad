'use client';

import { motion } from 'framer-motion';
import { AGENTS, Agent } from '@/lib/agents';
import Badge from '@/components/shared/Badge';
import { PipelineSignal } from '@/lib/signals';
import clsx from 'clsx';

interface AgentPanelProps {
  agentId: 'A' | 'B' | 'C' | 'D';
  events: PipelineSignal[];
  active: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

export default function AgentPanel({ agentId, events, active, expanded, onToggleExpand }: AgentPanelProps) {
  const agent = AGENTS[agentId];
  const outputRef = React.useRef<HTMLDivElement>(null);

  // Filter events for this agent
  const agentEvents = events.filter((e) => e.agent === agentId);
  const messages = agentEvents.filter(
    (e) =>
      e.type === 'agent_message' ||
      e.type === 'agent_question' ||
      e.type === 'agent_answer' ||
      e.type === 'file_written' ||
      e.type === 'test_result'
  );

  // Status
  const getStatus = (): { label: string; active: boolean } => {
    if (active) return { label: 'active', active: true };
    if (agentEvents.length > 0) {
      const lastEvent = agentEvents[agentEvents.length - 1];
      if (lastEvent.type === 'phase_complete') return { label: 'done', active: false };
      return { label: 'idle', active: false };
    }
    return { label: 'idle', active: false };
  };

  const status = getStatus();

  // Auto-scroll
  React.useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <motion.div
      layout
      className={clsx(
        'rounded-xl border overflow-hidden transition-all duration-300 cursor-pointer',
        expanded ? 'col-span-2 row-span-2' : ''
      )}
      style={{
        borderColor: active ? `${agent.color}60` : '#1e2740',
        backgroundColor: '#060912',
        boxShadow: active ? `0 0 20px ${agent.color}10` : 'none',
      }}
      onClick={onToggleExpand}
      whileHover={{ borderColor: `${agent.color}40` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: active ? `${agent.color}30` : '#1e2740' }}
      >
        <div className="flex items-center gap-3">
          {/* Agent icon */}
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
            style={{
              backgroundColor: `${agent.color}20`,
              color: agent.color,
              border: `1px solid ${agent.color}40`,
            }}
            animate={active ? { scale: [1, 1.1, 1], boxShadow: [`0 0 5px ${agent.color}20`, `0 0 15px ${agent.color}40`, `0 0 5px ${agent.color}20`] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {agent.id}
          </motion.div>

          <div>
            <h3 className="text-sm font-medium text-white">{agent.name}</h3>
            <span className="text-xs text-gray-500 font-mono">{agent.role}</span>
          </div>
        </div>

        <Badge
          label={status.label}
          color={agent.color}
          pulse={status.active}
        />
      </div>

      {/* Output */}
      <div
        ref={outputRef}
        className={clsx(
          'overflow-y-auto p-3 font-mono text-xs leading-relaxed',
          expanded ? 'h-64' : 'h-32'
        )}
      >
        {messages.length === 0 ? (
          <div className="text-gray-600 text-center py-4">Waiting for activity...</div>
        ) : (
          <div className="space-y-1">
            {messages.map((event, i) => (
              <motion.div
                key={`${event.timestamp}-${i}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={clsx(
                  'py-0.5',
                  event.type === 'file_written' && 'text-violet-400',
                  event.type === 'test_result' && (event.payload.failed > 0 ? 'text-rose-400' : 'text-green-400'),
                  event.type === 'agent_question' && 'text-amber-400',
                  event.type === 'agent_message' && 'text-gray-400'
                )}
              >
                <span style={{ color: agent.color }} className="mr-1">›</span>
                {event.type === 'file_written' && `📄 ${event.payload.path}`}
                {event.type === 'test_result' && `${event.payload.failed > 0 ? '✗' : '✓'} Tests: ${event.payload.passed} passed${event.payload.failed > 0 ? `, ${event.payload.failed} failed` : ''}`}
                {event.type === 'agent_question' && `❓ ${event.payload.question}`}
                {event.type === 'agent_answer' && `→ ${event.payload.answer}`}
                {event.type === 'agent_message' && event.payload.message}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

import React from 'react';
