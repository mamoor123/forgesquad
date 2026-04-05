// Simulated Supervisor agent behavior

export const SUPERVISOR_MESSAGES = [
  'Team assembled. Ready to begin.',
  'Concept received. Preparing to hand off to Planner.',
  'Forwarding concept to Planner for research and planning.',
  'Planner is working on the build plan...',
  'Plan received. Handing to Reviewer for challenge.',
  'Reviewer is analyzing the plan...',
  'Reviewer found issues. Sending back to Planner for revision.',
  'Revised plan received. Re-reviewing...',
  'Plan approved and locked. Proceeding to coding phase.',
  'Handing locked plan to Coder.',
  'Coder is implementing the plan...',
  'File written by Coder.',
  'Implementation complete. Handing to Tester.',
  'Tester is verifying code against plan...',
  'Tester found issues. Sending back to Coder for fixes.',
  'Fixes applied. Re-testing...',
  'All tests passed. Pipeline complete!',
  'Build delivered successfully.',
];

export const SUPERVISOR_CONCEPT_RESPONSES = [
  'Great concept. Let me break this down for the team.',
  'Interesting project. I\'ll have the Planner research the best approach.',
  'Got it. Capturing the requirements and dispatching the Planner.',
  'Clear objective. The team will handle this from here.',
];

export function getSupervisorMessage(index: number): string {
  return SUPERVISOR_MESSAGES[index % SUPERVISOR_MESSAGES.length];
}
