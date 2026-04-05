// Simulated Coder agent behavior

export const CODER_MESSAGES = [
  'Reading locked plan.md...',
  'Initializing project structure...',
  'Installing dependencies: npm install...',
  'Creating src/app/layout.tsx',
  'Creating src/app/page.tsx',
  'Creating src/app/globals.css',
  'Creating src/components/Dashboard.tsx',
  'Creating src/components/Header.tsx',
  'Creating src/components/Sidebar.tsx',
  'Creating src/components/DataTable.tsx',
  'Creating src/lib/api.ts',
  'Creating src/lib/hooks.ts',
  'Creating src/lib/utils.ts',
  'Creating src/types/index.ts',
  'Writing package.json configuration...',
  'Writing tsconfig.json...',
  'Configuring build pipeline...',
  'Running TypeScript compiler check...',
  'Running linter...',
  'Build successful. All files written.',
  'Handing to Tester for verification.',
];

export const FILES_WRITTEN = [
  { path: 'src/app/layout.tsx', lines: 24 },
  { path: 'src/app/page.tsx', lines: 45 },
  { path: 'src/app/globals.css', lines: 68 },
  { path: 'src/components/Dashboard.tsx', lines: 156 },
  { path: 'src/components/Header.tsx', lines: 42 },
  { path: 'src/components/Sidebar.tsx', lines: 89 },
  { path: 'src/components/DataTable.tsx', lines: 134 },
  { path: 'src/lib/api.ts', lines: 78 },
  { path: 'src/lib/hooks.ts', lines: 56 },
  { path: 'src/lib/utils.ts', lines: 34 },
  { path: 'src/types/index.ts', lines: 67 },
  { path: 'package.json', lines: 32 },
  { path: 'tsconfig.json', lines: 28 },
];

export function getCoderMessage(index: number): string {
  return CODER_MESSAGES[index % CODER_MESSAGES.length];
}

export function getFile(index: number): { path: string; lines: number } {
  return FILES_WRITTEN[index % FILES_WRITTEN.length];
}
