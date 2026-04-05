// Pipeline control API — start/stop/reset pipeline

import { NextRequest, NextResponse } from 'next/server';

// In-memory pipeline state for the API route
let pipelineStatus = 'idle';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { action, concept } = body;

  switch (action) {
    case 'start':
      pipelineStatus = 'running';
      return NextResponse.json({
        status: 'running',
        message: `Pipeline started${concept ? ` with concept: ${concept}` : ''}`,
        concept: concept || 'Build a task management app',
        timestamp: Date.now(),
      });

    case 'stop':
      pipelineStatus = 'paused';
      return NextResponse.json({
        status: 'paused',
        message: 'Pipeline paused',
        timestamp: Date.now(),
      });

    case 'continue':
      pipelineStatus = 'running';
      return NextResponse.json({
        status: 'running',
        message: 'Pipeline resumed',
        timestamp: Date.now(),
      });

    case 'reset':
      pipelineStatus = 'idle';
      return NextResponse.json({
        status: 'idle',
        message: 'Pipeline reset',
        timestamp: Date.now(),
      });

    default:
      return NextResponse.json(
        { error: `Unknown action: ${action}` },
        { status: 400 }
      );
  }
}

export async function GET() {
  return NextResponse.json({
    status: pipelineStatus,
    timestamp: Date.now(),
  });
}
