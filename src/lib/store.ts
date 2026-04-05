// In-memory state store for the pipeline

import { PipelinePhase, PipelineSignal, AgentId } from './signals';

export interface PipelineState {
  phase: PipelinePhase;
  activeAgent: AgentId | null;
  status: 'idle' | 'running' | 'paused' | 'done' | 'error';
  planLocked: boolean;
  errors: number;
  files: { path: string; lines: number; agent: AgentId }[];
  events: PipelineSignal[];
  startTime: number | null;
  concept: string;
  plan: string;
  reviewRound: number;
  codeRound: number;
  maxReviewRounds: number;
  maxCodeRounds: number;
}

export type StoreListener = (state: PipelineState) => void;

class PipelineStore {
  private state: PipelineState = this.getInitialState();
  private listeners: Set<StoreListener> = new Set();

  private getInitialState(): PipelineState {
    return {
      phase: 'idle',
      activeAgent: null,
      status: 'idle',
      planLocked: false,
      errors: 0,
      files: [],
      events: [],
      startTime: null,
      concept: '',
      plan: '',
      reviewRound: 0,
      codeRound: 0,
      maxReviewRounds: 3,
      maxCodeRounds: 3,
    };
  }

  getState(): PipelineState {
    return { ...this.state };
  }

  setState(update: Partial<PipelineState> | ((prev: PipelineState) => Partial<PipelineState>)): void {
    const changes = typeof update === 'function' ? update(this.state) : update;
    this.state = { ...this.state, ...changes };
    this.notify();
  }

  addEvent(event: PipelineSignal): void {
    this.state = {
      ...this.state,
      events: [...this.state.events, event],
    };
    this.notify();
  }

  reset(): void {
    this.state = this.getInitialState();
    this.notify();
  }

  subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = { ...this.state };
    this.listeners.forEach((fn) => fn(snapshot));
  }
}

export const store = new PipelineStore();
