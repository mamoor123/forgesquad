// Core pipeline orchestrator — manages the state machine

import { PipelineSignal, PipelinePhase, AgentId, createSignal, createMessage, createPhaseStart, createPhaseComplete, createFileWritten } from './signals';
import { PHASE_AGENTS } from './pipeline';

export type OrchestratorEvent = (signal: PipelineSignal) => void;

export interface OrchestratorState {
  phase: PipelinePhase;
  status: 'idle' | 'running' | 'paused' | 'done' | 'error';
  activeAgent: AgentId | null;
  planLocked: boolean;
  reviewRound: number;
  codeRound: number;
  concept: string;
}

export class Orchestrator {
  private state: OrchestratorState = {
    phase: 'idle',
    status: 'idle',
    activeAgent: null,
    planLocked: false,
    reviewRound: 0,
    codeRound: 0,
    concept: '',
  };

  private listeners: OrchestratorEvent[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  getState(): OrchestratorState {
    return { ...this.state };
  }

  onEvent(listener: OrchestratorEvent): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(signal: PipelineSignal): void {
    this.listeners.forEach((fn) => fn(signal));
  }

  private emitMessage(agent: AgentId, message: string): void {
    this.emit(createMessage(agent, this.state.phase, message));
  }

  start(concept: string = 'Build a task management app'): void {
    if (this.state.status === 'running') return;
    this.state.concept = concept;
    this.state.status = 'running';
    this.state.phase = 'concept';
    this.state.activeAgent = 'S';
    this.running = true;

    this.emit(createPhaseStart('concept', 'S'));
    this.emitMessage('S', 'Team assembled. Ready to begin.');
    this.emitMessage('S', `Concept: "${concept}"`);
    this.emitMessage('S', 'Forwarding concept to Planner for research and planning.');

    this.schedule(() => this.enterPhase('planning'), 1500);
  }

  continue(): void {
    if (this.state.status !== 'paused') return;
    this.state.status = 'running';
    this.running = true;
    this.emitMessage('S', 'Continuing build...');
    this.schedule(() => this.enterPhase(this.state.phase), 1000);
  }

  pause(): void {
    this.state.status = 'paused';
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.emitMessage('S', 'Pipeline paused.');
  }

  stop(): void {
    this.state.status = 'idle';
    this.state.phase = 'idle';
    this.state.activeAgent = null;
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.emitMessage('S', 'Pipeline stopped.');
  }

  reset(): void {
    this.stop();
    this.state = {
      phase: 'idle',
      status: 'idle',
      activeAgent: null,
      planLocked: false,
      reviewRound: 0,
      codeRound: 0,
      concept: '',
    };
    this.emit(createSignal('pipeline_reset', 'S', 'idle', {}));
  }

  private schedule(fn: () => void, delay: number): void {
    if (!this.running) return;
    this.timer = setTimeout(() => {
      if (this.running) fn();
    }, delay);
  }

  private enterPhase(phase: PipelinePhase): void {
    if (!this.running) return;
    this.state.phase = phase;
    const agent = PHASE_AGENTS[phase] as AgentId;
    this.state.activeAgent = agent;
    this.emit(createPhaseStart(phase, agent));

    switch (phase) {
      case 'planning':
        this.runPlanningPhase();
        break;
      case 'reviewing':
        this.runReviewingPhase();
        break;
      case 'coding':
        this.runCodingPhase();
        break;
      case 'testing':
        this.runTestingPhase();
        break;
      case 'done':
        this.runDonePhase();
        break;
    }
  }

  private runPlanningPhase(): void {
    const messages = [
      'Reading the build-plan-template.md...',
      'Analyzing requirements from concept...',
      'Researching best practices and architecture patterns...',
      'Identifying key components and data flow...',
      'Mapping out the file structure...',
      'Writing plan: src/app/layout.tsx — root layout with providers',
      'Writing plan: src/app/page.tsx — main entry point',
      'Writing plan: src/components/Dashboard.tsx — primary UI component',
      'Writing plan: src/lib/api.ts — API client layer',
      'Writing plan: src/lib/hooks.ts — custom React hooks',
      'Writing plan: src/types/index.ts — TypeScript type definitions',
      'Reviewing plan against checklist...',
      'Running self-review pass...',
      'Plan complete. 7 files specified with full implementations.',
      'Handing plan to Reviewer for challenge phase.',
    ];

    let i = 0;
    const next = () => {
      if (!this.running || i >= messages.length) {
        if (this.running) this.schedule(() => this.enterPhase('reviewing'), 800);
        return;
      }
      this.emitMessage('A', messages[i]);
      i++;
      this.schedule(next, 600 + Math.random() * 400);
    };
    next();
  }

  private runReviewingPhase(): void {
    const round = this.state.reviewRound;
    const approveOnRound = 1;

    if (round < approveOnRound) {
      // First round: find issues, send back to planner
      const messages = [
        'Loading plan.md for review...',
        'Scanning file structure for completeness...',
        'Checking: are all TypeScript interfaces defined?',
        'Checking: are error boundaries included?',
        'Question: The plan mentions WebSocket integration but doesn\'t include reconnection logic.',
        'Question: No test files included. Add at least unit tests for the API layer.',
        'Question: The auth flow is missing token refresh.',
        'Review complete. 3 issues found. Sending back to Planner.',
      ];

      let i = 0;
      const next = () => {
        if (!this.running || i >= messages.length) {
          if (this.running) {
            this.emitMessage('S', 'Reviewer found issues. Sending back to Planner for revision.');
            this.state.reviewRound = round + 1;
            // Go back to planning
            this.schedule(() => this.enterPhase('planning'), 800);
          }
          return;
        }
        this.emitMessage('B', messages[i]);
        i++;
        this.schedule(next, 500 + Math.random() * 300);
      };
      next();
    } else {
      // Second round: approve
      const messages = [
        'Re-reviewing revised plan...',
        'Verifying all gaps have been addressed...',
        'Checking: WebSocket reconnection logic — added ✓',
        'Checking: Test files — included ✓',
        'Checking: Token refresh flow — specified ✓',
        'All questions resolved.',
        'Plan approved. Locking plan.md.',
        'Plan locked. Sending to Coder for implementation.',
      ];

      let i = 0;
      const next = () => {
        if (!this.running || i >= messages.length) {
          if (this.running) {
            this.state.planLocked = true;
            this.emit(createSignal('plan_locked', 'B', 'reviewing', { locked: true }));
            this.emitMessage('S', 'Plan approved and locked. Proceeding to coding phase.');
            this.schedule(() => this.enterPhase('coding'), 800);
          }
          return;
        }
        this.emitMessage('B', messages[i]);
        i++;
        this.schedule(next, 500 + Math.random() * 300);
      };
      next();
    }
  }

  private runCodingPhase(): void {
    const files = [
      { path: 'src/app/layout.tsx', lines: 24 },
      { path: 'src/app/page.tsx', lines: 45 },
      { path: 'src/components/Dashboard.tsx', lines: 156 },
      { path: 'src/components/Header.tsx', lines: 42 },
      { path: 'src/components/Sidebar.tsx', lines: 89 },
      { path: 'src/lib/api.ts', lines: 78 },
      { path: 'src/lib/hooks.ts', lines: 56 },
      { path: 'src/types/index.ts', lines: 67 },
    ];

    const preMessages = [
      'Reading locked plan.md...',
      'Initializing project structure...',
      'Installing dependencies: npm install...',
    ];

    const postMessages = [
      'Running TypeScript compiler check... ✓',
      'Running linter... ✓',
      'Build successful. All files written.',
      'Handing to Tester for verification.',
    ];

    let phase: 'pre' | 'files' | 'post' = 'pre';
    let preIdx = 0;
    let fileIdx = 0;
    let postIdx = 0;

    const next = () => {
      if (!this.running) return;

      if (phase === 'pre') {
        if (preIdx < preMessages.length) {
          this.emitMessage('C', preMessages[preIdx]);
          preIdx++;
          this.schedule(next, 500 + Math.random() * 300);
        } else {
          phase = 'files';
          this.schedule(next, 200);
        }
      } else if (phase === 'files') {
        if (fileIdx < files.length) {
          const file = files[fileIdx];
          this.emitMessage('C', `Creating ${file.path}`);
          this.emit(createFileWritten('C', file.path, file.lines));
          fileIdx++;
          this.schedule(next, 400 + Math.random() * 400);
        } else {
          phase = 'post';
          this.schedule(next, 200);
        }
      } else {
        if (postIdx < postMessages.length) {
          this.emitMessage('C', postMessages[postIdx]);
          postIdx++;
          this.schedule(next, 500 + Math.random() * 300);
        } else {
          if (this.running) this.schedule(() => this.enterPhase('testing'), 800);
        }
      }
    };
    next();
  }

  private runTestingPhase(): void {
    const round = this.state.codeRound;
    const approveOnRound = 1;

    if (round < approveOnRound) {
      const messages = [
        'Reading locked plan.md...',
        'Reading implemented code...',
        'Cross-referencing code against plan...',
        'Running TypeScript compiler... ✓',
        'Running unit tests...',
        '✓ src/components/Dashboard.test.tsx — 12/12 passed',
        '✓ src/lib/api.test.ts — 8/8 passed',
        'FAIL: src/lib/hooks.test.ts — 2/6 failed',
        'FAIL: Missing error boundary in Dashboard component',
        '2 issues found. Sending back to Coder for fixes.',
      ];

      let i = 0;
      const next = () => {
        if (!this.running || i >= messages.length) {
          if (this.running) {
            this.emitMessage('S', 'Tester found issues. Sending back to Coder for fixes.');
            this.state.codeRound = round + 1;
            // Go back to coding
            this.schedule(() => {
              this.state.phase = 'coding';
              this.state.activeAgent = 'C';
              this.emit(createPhaseStart('coding', 'C'));
              this.runFixPhase();
            }, 800);
          }
          return;
        }
        this.emitMessage('D', messages[i]);
        i++;
        this.schedule(next, 400 + Math.random() * 300);
      };
      next();
    } else {
      // Second round: all pass
      const messages = [
        'Re-running all tests...',
        '✓ src/components/Dashboard.test.tsx — 12/12 passed',
        '✓ src/lib/api.test.ts — 8/8 passed',
        '✓ src/lib/hooks.test.ts — 6/6 passed',
        'Running integration tests... ✓',
        'Running build... ✓',
        'Bundle size: 142KB (within 200KB budget)',
        'All 8 files verified against plan.',
        'All tests passing. Pipeline complete!',
      ];

      let i = 0;
      const next = () => {
        if (!this.running || i >= messages.length) {
          if (this.running) {
            this.schedule(() => this.enterPhase('done'), 500);
          }
          return;
        }
        this.emitMessage('D', messages[i]);
        i++;
        this.schedule(next, 400 + Math.random() * 300);
      };
      next();
    }
  }

  private runFixPhase(): void {
    const messages = [
      'Applying fixes to src/lib/hooks.ts...',
      'Adding error boundary to Dashboard...',
      'Fixes applied. Re-checking... ✓',
      'Handing back to Tester.',
    ];

    let i = 0;
    const next = () => {
      if (!this.running || i >= messages.length) {
        if (this.running) this.schedule(() => this.enterPhase('testing'), 800);
        return;
      }
      this.emitMessage('C', messages[i]);
      i++;
      this.schedule(next, 500 + Math.random() * 300);
    };
    next();
  }

  private runDonePhase(): void {
    this.state.activeAgent = 'S';
    this.state.status = 'done';
    this.running = false;
    this.emit(createPhaseComplete('done', 'S'));
    this.emitMessage('S', '🎉 Pipeline complete! Build delivered successfully.');
    this.emitMessage('S', 'Total files: 8 | Errors: 0 | Status: PASSED');
  }
}

// Singleton for client-side use
let orchestratorInstance: Orchestrator | null = null;

export function getOrchestrator(): Orchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new Orchestrator();
  }
  return orchestratorInstance;
}
