// Agent definitions - the 5-member dev team

export interface Agent {
  id: 'S' | 'A' | 'B' | 'C' | 'D';
  name: string;
  role: string;
  color: string;
  icon: string;
  description: string;
}

export const AGENTS: Record<Agent['id'], Agent> = {
  S: {
    id: 'S',
    name: 'Supervisor',
    role: 'Overseer',
    color: '#00d4ff',
    icon: 'eye',
    description: 'Orchestrates the team, captures concepts, manages the pipeline',
  },
  A: {
    id: 'A',
    name: 'Planner',
    role: 'Architect',
    color: '#10b981',
    icon: 'compass',
    description: 'Researches and writes complete build plans with copy-pasteable code',
  },
  B: {
    id: 'B',
    name: 'Reviewer',
    role: 'Challenger',
    color: '#f59e0b',
    icon: 'search',
    description: 'Tears apart plans, sends structured questions, approves or rejects',
  },
  C: {
    id: 'C',
    name: 'Coder',
    role: 'Builder',
    color: '#8b5cf6',
    icon: 'terminal',
    description: 'Reads locked plan and builds exactly what it specifies',
  },
  D: {
    id: 'D',
    name: 'Tester',
    role: 'Verifier',
    color: '#f43f5e',
    icon: 'check-circle',
    description: 'Reviews code against plan, runs tests, loops with coder until passing',
  },
};

export const SPECIALIST_AGENTS = ['A', 'B', 'C', 'D'] as const;
export type SpecialistId = (typeof SPECIALIST_AGENTS)[number];

export function getAgentColor(id: Agent['id']): string {
  return AGENTS[id].color;
}

export function getAgentName(id: Agent['id']): string {
  return AGENTS[id].name;
}
