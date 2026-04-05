// Signal types for pipeline communication

export type PipelinePhase = 'idle' | 'concept' | 'planning' | 'reviewing' | 'coding' | 'testing' | 'done';

export type AgentId = 'S' | 'A' | 'B' | 'C' | 'D';

export type SignalType =
  | 'phase_start'
  | 'phase_complete'
  | 'agent_message'
  | 'agent_question'
  | 'agent_answer'
  | 'error'
  | 'file_written'
  | 'test_result'
  | 'status_update'
  | 'plan_locked'
  | 'pipeline_reset';

export interface PipelineSignal {
  type: SignalType;
  agent: AgentId;
  phase: PipelinePhase;
  payload: any;
  timestamp: number;
}

export function createSignal(
  type: SignalType,
  agent: AgentId,
  phase: PipelinePhase,
  payload: any = {}
): PipelineSignal {
  return {
    type,
    agent,
    phase,
    payload,
    timestamp: Date.now(),
  };
}

export function createMessage(agent: AgentId, phase: PipelinePhase, message: string): PipelineSignal {
  return createSignal('agent_message', agent, phase, { message });
}

export function createPhaseStart(phase: PipelinePhase, agent: AgentId): PipelineSignal {
  return createSignal('phase_start', agent, phase, { phase });
}

export function createPhaseComplete(phase: PipelinePhase, agent: AgentId): PipelineSignal {
  return createSignal('phase_complete', agent, phase, { phase });
}

export function createFileWritten(agent: AgentId, path: string, lines: number): PipelineSignal {
  return createSignal('file_written', agent, 'coding', { path, lines });
}

export function createTestResult(agent: AgentId, passed: number, failed: number, details: string): PipelineSignal {
  return createSignal('test_result', agent, 'testing', { passed, failed, details });
}

export function createQuestion(agent: AgentId, phase: PipelinePhase, question: string): PipelineSignal {
  return createSignal('agent_question', agent, phase, { question });
}

export function createAnswer(agent: AgentId, phase: PipelinePhase, answer: string): PipelineSignal {
  return createSignal('agent_answer', agent, phase, { answer });
}
