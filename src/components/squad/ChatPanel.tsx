'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { PipelineSignal } from '@/lib/signals';
import { AGENTS } from '@/lib/agents';

interface ChatPanelProps {
  agentId: 'S' | 'A' | 'B' | 'C' | 'D';
  events: PipelineSignal[];
  onSend: (message: string) => void;
}

export default function ChatPanel({ agentId, events, onSend }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const agent = AGENTS[agentId];

  const messages = events.filter(
    (e) =>
      e.agent === agentId &&
      (e.type === 'agent_message' ||
        e.type === 'agent_question' ||
        e.type === 'agent_answer' ||
        e.type === 'file_written' ||
        e.type === 'test_result')
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                backgroundColor: `${agent.color}15`,
                border: `2px solid ${agent.color}30`,
              }}
            >
              <span
                className="text-2xl font-mono font-bold"
                style={{ color: agent.color }}
              >
                {agent.id}
              </span>
            </div>
            <h3 className="text-white font-medium mb-1">
              {agent.name}
            </h3>
            <p className="text-gray-500 text-sm font-mono">
              {agent.role} — {agent.description}
            </p>
            <p className="text-gray-600 text-xs mt-2">
              {agentId === 'S'
                ? 'Describe what you want to build, or click Full Build to start.'
                : `Waiting for pipeline to reach ${agent.name}'s phase...`}
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((event, i) => (
              <motion.div
                key={`${event.timestamp}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0"
                  style={{
                    backgroundColor: `${agent.color}20`,
                    color: agent.color,
                    border: `1px solid ${agent.color}40`,
                  }}
                >
                  {agent.id}
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: agent.color }}>
                      {agent.name}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">
                      {new Date(event.timestamp).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 font-mono leading-relaxed break-all">
                    {event.type === 'file_written' && (
                      <span className="text-violet-400">
                        📄 Created {event.payload.path} ({event.payload.lines} lines)
                      </span>
                    )}
                    {event.type === 'test_result' && (
                      <span
                        className={
                          event.payload.failed > 0
                            ? 'text-rose-400'
                            : 'text-green-400'
                        }
                      >
                        {event.payload.failed > 0 ? '✗' : '✓'} Tests: {event.payload.passed} passed
                        {event.payload.failed > 0 && `, ${event.payload.failed} failed`}
                      </span>
                    )}
                    {event.type === 'agent_message' && event.payload.message}
                    {event.type === 'agent_question' && (
                      <span className="text-amber-400">
                        ❓ {event.payload.question}
                      </span>
                    )}
                    {event.type === 'agent_answer' && (
                      <span className="text-emerald-400">
                        → {event.payload.answer}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1e2740]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${agent.name}...`}
            className="flex-1 bg-[#111827] border border-[#2a3655] rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
            style={{
              borderColor: `${agent.color}20`,
            }}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2.5 rounded-lg transition-all duration-200 hover:brightness-110"
            style={{
              backgroundColor: `${agent.color}20`,
              border: `1px solid ${agent.color}30`,
              color: agent.color,
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
