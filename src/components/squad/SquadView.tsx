'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import AgentTabs from './AgentTabs';
import ChatPanel from './ChatPanel';
import { Orchestrator, getOrchestrator } from '@/lib/orchestrator';
import { PipelineSignal, PipelinePhase, AgentId } from '@/lib/signals';
import Badge from '@/components/shared/Badge';
import { Zap, RotateCcw, Square } from 'lucide-react';

export default function SquadView() {
  const orchRef = useRef<Orchestrator>(getOrchestrator());
  const [activeTab, setActiveTab] = useState<string>('S');
  const [state, setState] = useState<{
    phase: PipelinePhase;
    status: 'idle' | 'running' | 'paused' | 'done' | 'error';
    activeAgent: string | null;
    events: PipelineSignal[];
  }>({
    phase: 'idle',
    status: 'idle',
    activeAgent: null,
    events: [],
  });

  useEffect(() => {
    const orch = orchRef.current;
    const unsub = orch.onEvent((signal: PipelineSignal) => {
      setState((prev) => {
        const orchState = orch.getState();
        return {
          phase: orchState.phase,
          status: orchState.status,
          activeAgent: orchState.activeAgent,
          events: [...prev.events, signal],
        };
      });
    });

    return () => {
      unsub();
    };
  }, []);

  const handleStart = useCallback(() => {
    orchRef.current.start('Build a modern task management application');
  }, []);

  const handleStop = useCallback(() => {
    orchRef.current.pause();
    setState((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const handleReset = useCallback(() => {
    setState({
      phase: 'idle',
      status: 'idle',
      activeAgent: null,
      events: [],
    });
    orchRef.current.reset();
  }, []);

  const handleChatSend = useCallback(
    (message: string) => {
      setState((prev) => ({
        ...prev,
        events: [
          ...prev.events,
          {
            type: 'agent_message',
            agent: activeTab as AgentId,
            phase: prev.phase,
            payload: { message: `[You]: ${message}` },
            timestamp: Date.now(),
          },
        ],
      }));

      // If idle and talking to supervisor, could auto-start
      if (state.status === 'idle' && activeTab === 'S') {
        // User's message is captured, they can start the pipeline
      }
    },
    [activeTab, state.status]
  );

  return (
    <div className="flex flex-col h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1e2740] bg-[#060912]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              Forge<span className="text-cyan-400">Squad</span>
            </h1>
            <span className="text-xs text-gray-500 font-mono ml-2">/squad</span>
          </div>

          <div className="h-4 w-px bg-[#2a3655]" />
          <Badge
            label={state.phase === 'idle' ? 'Ready' : state.phase.toUpperCase()}
            color={
              state.status === 'running'
                ? '#10b981'
                : state.status === 'done'
                ? '#22c55e'
                : state.status === 'paused'
                ? '#f59e0b'
                : '#64748b'
            }
            pulse={state.status === 'running'}
          />
        </div>

        <div className="flex items-center gap-2">
          {state.status === 'idle' && (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Zap className="w-4 h-4" />
              Full Build
            </button>
          )}
          {state.status === 'running' && (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-600/30 rounded-lg text-sm font-medium transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          )}
          {state.status !== 'idle' && state.status !== 'running' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e2740] hover:bg-[#2a3655] text-gray-400 border border-[#2a3655] rounded-lg text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </header>

      {/* Tab strip */}
      <div className="px-6 py-3 border-b border-[#1e2740]">
        <AgentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0">
        <ChatPanel
          agentId={activeTab as 'S' | 'A' | 'B' | 'C' | 'D'}
          events={state.events}
          onSend={handleChatSend}
        />
      </div>
    </div>
  );
}
