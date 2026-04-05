// Simulated Tester agent behavior

export const TESTER_MESSAGES = [
  'Reading locked plan.md...',
  'Reading implemented code...',
  'Cross-referencing code against plan...',
  'Running TypeScript compiler...',
  '✓ TypeScript compilation passed',
  'Running linter...',
  '✓ Lint passed — 0 warnings',
  'Running unit tests...',
  '✓ src/components/Dashboard.test.tsx — 12/12 passed',
  '✓ src/lib/api.test.ts — 8/8 passed',
  '✓ src/lib/hooks.test.ts — 6/6 passed',
  'Running integration tests...',
  '✓ API integration — all endpoints responding',
  '✓ Component rendering — no hydration errors',
  'Running build...',
  '✓ Production build successful',
  'Checking bundle size...',
  '✓ Bundle size: 142KB (within 200KB budget)',
  'Verifying all files match plan...',
  'All 13 files match plan specifications.',
  'All tests passing. Build verified.',
  'Test report complete. Pipeline complete.',
];

export const TEST_FAILURE_MESSAGES = [
  'FAIL: src/components/DataTable.tsx — missing error boundary',
  'FAIL: src/lib/api.ts — no timeout on fetch requests',
  'FAIL: TypeScript strict mode error in hooks.ts:23',
  'FAIL: Build failed — missing import in Dashboard.tsx',
];

export function getTesterMessage(index: number): string {
  return TESTER_MESSAGES[index % TESTER_MESSAGES.length];
}
