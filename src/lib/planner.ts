// Simulated Planner agent behavior

export const PLANNER_MESSAGES = [
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
  'Writing plan: src/styles/theme.css — design tokens',
  'Reviewing plan against checklist...',
  'Checking: every file has complete code, no placeholders',
  'Checking: dependencies are pinned to specific versions',
  'Checking: error handling is included in every async operation',
  'Checking: TypeScript strict mode compliance',
  'Running self-review pass on the build plan...',
  'Plan complete. 8 files written with full implementations.',
  'Handing plan to Reviewer for challenge phase.',
];

export const PLANNER_QUESTIONS = [
  'Should we use server components or client components for the main dashboard?',
  'Do you prefer REST API routes or tRPC for the backend?',
  'What authentication strategy should we use?',
  'Should we add real-time updates with WebSocket or polling?',
];

export function getPlannerMessage(index: number): string {
  return PLANNER_MESSAGES[index % PLANNER_MESSAGES.length];
}
