'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orchestrator, getOrchestrator } from '@/lib/orchestrator';
import { PipelineSignal, PipelinePhase } from '@/lib/signals';
import PhaseTracker from './PhaseTracker';
import AgentPanel from './AgentPanel';
import LiveFeed from './LiveFeed';
import ControlBar from './ControlBar';
import StatsBar from './StatsBar';
import PixelOffice from '@/components/pixel/PixelOffice';
import Badge from '@/components/shared/Badge';
import { Eye, MessageSquare, Send, X } from 'lucide-react';

interface PipelineState {
  phase: PipelinePhase;
  status: 'idle' | 'running' | 'paused' | 'done' | 'error';
  activeAgent: string | null;
  events: PipelineSignal[];
  fileCount: number;
  errorCount: number;
  startTime: number | null;
}

export default function OfficeView() {
  const orchRef = useRef<Orchestrator>(getOrchestrator());
  const [state, setState] = useState<PipelineState>({
    phase: 'idle',
    status: 'idle',
    activeAgent: null,
    events: [],
    fileCount: 0,
    errorCount: 0,
    startTime: null,
  });
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Subscribe to orchestrator events
  useEffect(() => {
    const orch = orchRef.current;
    const unsub = orch.onEvent((signal: PipelineSignal) => {
      setState((prev) => {
        const newEvents = [...prev.events, signal];
        let newFileCount = prev.fileCount;
        let newErrorCount = prev.errorCount;
        let newStartTime = prev.startTime;

        if (signal.type === 'file_written') newFileCount++;
        if (signal.type === 'error') newErrorCount++;
        if (signal.type === 'phase_start' && !prev.startTime) newStartTime = Date.now();

        const orchState = orch.getState();

        return {
          phase: orchState.phase,
          status: orchState.status,
          activeAgent: orchState.activeAgent,
          events: newEvents,
          fileCount: newFileCount,
          errorCount: newErrorCount,
          startTime: newStartTime,
        };
      });
    });

    return () => {
      unsub();
      orch.stop();
    };
  }, []);

  const handleStart = useCallback(() => {
    orchRef.current.start('Build a modern task management application with React and TypeScript');
  }, []);

  const handleStop = useCallback(() => {
    orchRef.current.pause();
    setState((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const handleContinue = useCallback(() => {
    orchRef.current.continue();
    setState((prev) => ({ ...prev, status: 'running' }));
  }, []);

  const handleReset = useCallback(() => {
    orchRef.current.reset();
    setState({
      phase: 'idle',
      status: 'idle',
      activeAgent: null,
      events: [],
      fileCount: 0,
      errorCount: 0,
      startTime: null,
    });
    setShowPlan(false);
  }, []);

  const handleViewPlan = useCallback(() => {
    setShowPlan(true);
  }, []);

  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;
    // Add as a concept message
    setState((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          type: 'agent_message',
          agent: 'S',
          phase: prev.phase,
          payload: { message: `[You]: ${chatInput}` },
          timestamp: Date.now(),
        },
      ],
    }));
    setChatInput('');
  }, [chatInput]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0e1a] text-white overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1e2740] bg-[#060912]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h1 className="text-lg font-semibold tracking-tight">
              Forge<span className="text-cyan-400">Squad</span>
            </h1>
          </div>

          {/* Pipeline status */}
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

        <StatsBar
          startTime={state.startTime}
          fileCount={state.fileCount}
          errorCount={state.errorCount}
          status={state.status}
        />
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Supervisor + Pipeline */}
        <div className="w-80 flex flex-col border-r border-[#1e2740] bg-[#060912]/40">
          {/* Mission control visualization */}
          <div className="p-4 border-b border-[#1e2740]">
            <PixelOffice activeAgent={state.activeAgent} phase={state.phase} />
          </div>

          {/* Phase tracker */}
          <div className="px-4 py-3 border-b border-[#1e2740]">
            <h3 className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-3">
              Pipeline Progress
            </h3>
            <PhaseTracker phase={state.phase} />
          </div>

          {/* Supervisor chat */}
          <div className="flex-1 flex flex-col min-h-0">
            <div
              className="flex items-center gap-2 px-4 py-2 border-b border-[#1e2740]"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-400">Supervisor</span>
              <MessageSquare className="w-3.5 h-3.5 text-gray-500 ml-auto" />
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-3">
              {state.events.filter((e) => e.agent === 'S').length === 0 ? (
                <div className="text-gray-600 text-sm font-mono text-center py-8">
                  Click <span className="text-cyan-400">Full Build</span> to start the pipeline, or describe your project here.
                </div>
              ) : (
                <div className="space-y-2">
                  {state.events
                    .filter((e) => e.agent === 'S')
                    .map((e, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm font-mono"
                      >
                        <span className="text-cyan-400 mr-1">S ›</span>
                        <span
                          className={
                            e.payload.message?.startsWith('[You]:')
                              ? 'text-white'
                              : 'text-gray-300'
                          }
                        >
                          {e.payload.message}
                        </span>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-[#1e2740]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Talk to the Supervisor..."
                  className="flex-1 bg-[#111827] border border-[#2a3655] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
                <button
                  onClick={handleChatSend}
                  className="p-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 rounded-lg text-cyan-400 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="p-3 border-t border-[#1e2740]">
            <ControlBar
              status={state.status}
              phase={state.phase}
              onStart={handleStart}
              onStop={handleStop}
              onContinue={handleContinue}
              onReset={handleReset}
              onViewPlan={handleViewPlan}
            />
          </div>
        </div>

        {/* Right panel - Agent grid */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Agent panels grid */}
          <div className="flex-1 p-4 grid grid-cols-2 grid-rows-2 gap-3 auto-rows-fr">
            {(['A', 'B', 'C', 'D'] as const).map((id) => (
              <AgentPanel
                key={id}
                agentId={id}
                events={state.events}
                active={state.activeAgent === id}
                expanded={expandedPanel === id}
                onToggleExpand={() =>
                  setExpandedPanel(expandedPanel === id ? null : id)
                }
              />
            ))}
          </div>

          {/* Live feed */}
          <div className="h-48 border-t border-[#1e2740] px-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                Live Feed
              </h3>
              <span className="text-xs text-gray-600 font-mono ml-auto">
                {state.events.length} events
              </span>
            </div>
            <div className="h-36">
              <LiveFeed events={state.events} />
            </div>
          </div>
        </div>
      </div>

      {/* Plan modal */}
      <AnimatePresence>
        {showPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8"
            onClick={() => setShowPlan(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#060912] border border-[#1e2740] rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2740]">
                <h2 className="text-lg font-semibold text-white">Build Plan</h2>
                <button
                  onClick={() => setShowPlan(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] font-mono text-sm">
                <div className="space-y-4 text-gray-300">
                  <h3 className="text-xl font-bold text-white">Task Management App — Build Plan</h3>
                  <p className="text-gray-400">Generated by Planner • Approved by Reviewer</p>
                  <hr className="border-[#2a3655]" />
                  
                  <h4 className="text-lg font-semibold text-white">File Structure</h4>
                  <pre className="bg-[#111827] p-3 rounded-lg text-xs overflow-x-auto">{`project/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Main dashboard
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── Dashboard.tsx     # Primary UI
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Sidebar.tsx       # Task filter sidebar
│   │   └── DataTable.tsx     # Task list component
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   ├── hooks.ts          # Custom hooks
│   │   └── utils.ts          # Utility functions
│   └── types/
│       └── index.ts          # TypeScript definitions
├── package.json
└── tsconfig.json`}</pre>

                  <h4 className="text-lg font-semibold text-white">Key Decisions</h4>
                  <ul className="space-y-1 list-disc list-inside text-gray-400">
                    <li>Next.js App Router for SSR + client-side navigation</li>
                    <li>React Context for state management (lightweight, no external deps)</li>
                    <li>WebSocket for real-time task updates</li>
                    <li>Tailwind CSS for styling</li>
                    <li>TypeScript strict mode throughout</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-white">Status</h4>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium border border-emerald-500/30">
                      ✓ Locked
                    </span>
                    <span className="text-gray-500">
                      Plan approved by Reviewer after 1 revision cycle
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
