# ForgeSquad Architecture

## System Overview

ForgeSquad is a Next.js application that simulates a multi-agent development team pipeline. The architecture is designed to eventually support real agent integration, but currently provides a fully functional simulated experience.

## Core Components

### Orchestrator (`src/lib/orchestrator.ts`)
The central state machine that manages pipeline phases and agent transitions.

```
idle → concept → planning → reviewing → coding → testing → done
         ↑                    ↓              ↑           ↓
         └────────────────────┘              └───────────┘
           Plan-Review Loop                    Code-Test Loop
```

**Key behaviors:**
- Plan-Review loop: Planner writes → Reviewer challenges → if issues, back to Planner (up to 2 rounds)
- Code-Test loop: Coder implements → Tester verifies → if failures, back to Coder (up to 2 rounds)
- Supervisor can pause/resume/stop at any phase boundary
- Events are emitted via EventEmitter pattern for real-time UI updates

### Signal System (`src/lib/signals.ts`)
JSON signals for pipeline communication:

```typescript
interface PipelineSignal {
  type: 'phase_start' | 'phase_complete' | 'agent_message' | 'agent_question' | 'file_written' | 'test_result' | ...;
  agent: 'S' | 'A' | 'B' | 'C' | 'D';
  phase: PipelinePhase;
  payload: any;
  timestamp: number;
}
```

### Agent Definitions (`src/lib/agents.ts`)
Static role definitions with colors and metadata. Each agent has a unique color:
- Supervisor: `#00d4ff` (cyan)
- Planner: `#10b981` (emerald)
- Reviewer: `#f59e0b` (amber)
- Coder: `#8b5cf6` (violet)
- Tester: `#f43f5e` (rose)

## UI Architecture

### Office View (`/`)
- **Left panel**: Supervisor chat + Mission Control visualization + Phase Tracker + Controls
- **Right panel**: 2×2 grid of agent panels (Planner, Reviewer, Coder, Tester)
- **Bottom**: Live event feed with color-coded, timestamped events

### Squad View (`/squad`)
- **Header**: Logo + status + controls
- **Tab strip**: Switch between all 5 agents
- **Chat area**: Full-height chat with selected agent

### Component Hierarchy
```
OfficeView
├── PixelOffice (CSS mission control viz)
├── PhaseTracker (progress bar)
├── AgentPanel × 4 (per-agent output)
├── LiveFeed (event stream)
├── ControlBar (start/stop/reset)
└── StatsBar (elapsed, files, errors)

SquadView
├── AgentTabs
└── ChatPanel
```

## WebSocket Server

Standalone `ws` server (`scripts/ws-server.mjs`) runs on port 3001 alongside Next.js. Clients connect for real-time signal broadcasting. In v1, the orchestrator runs client-side; WS is for future multi-client support.

## State Flow

```
User clicks "Full Build"
    ↓
Orchestrator.start()
    ↓
Emits phase_start(concept, S)
    ↓
Timer-based simulation of agent messages
    ↓
Each agent emits agent_message signals
    ↓
React state updates → UI re-renders
    ↓
Framer Motion animates transitions
```

## Future Integration Points

The architecture is ready for real agent integration:
1. Replace simulated messages in `orchestrator.ts` with actual agent I/O
2. WebSocket server broadcasts signals from remote agents
3. `src/lib/doctrine/` contains build-plan-template.md and checklist.md that real agents would follow
4. Signal types already support questions/answers for plan-review and code-test loops
