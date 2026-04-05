// Simulated Reviewer agent behavior

export const REVIEWER_MESSAGES = [
  'Loading plan.md for review...',
  'Scanning file structure for completeness...',
  'Checking: are all TypeScript interfaces defined?',
  'Checking: are error boundaries included?',
  'Checking: is the API layer fully specified?',
  'Checking: are loading and error states handled?',
  'Question: The plan mentions WebSocket integration but doesn\'t include reconnection logic. Add it.',
  'Question: No test files included. Add at least unit tests for the API layer.',
  'Question: The auth flow is missing token refresh. Clarify.',
  'Question: State management approach needs more detail — Redux, Zustand, or Context?',
  'Reviewing revised plan...',
  'Verifying all gaps have been addressed...',
  'Checking edge cases in error handling...',
  'Verifying type safety across all components...',
  'All questions resolved.',
  'Plan approved. Locking plan.md.',
  'Plan locked. Sending to Coder for implementation.',
];

export const REVIEWER_QUESTIONS = [
  'Where is the error boundary for the dashboard component?',
  'The WebSocket reconnection strategy is missing exponential backoff.',
  'How does the auth flow handle token expiration during active sessions?',
  'The state management needs a clear strategy for cache invalidation.',
];

export function getReviewerMessage(index: number): string {
  return REVIEWER_MESSAGES[index % REVIEWER_MESSAGES.length];
}
