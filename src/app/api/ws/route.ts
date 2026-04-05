// WebSocket route placeholder
// Actual WebSocket server runs as standalone process via scripts/ws-server.mjs
// This route provides connection info to the client

import { NextResponse } from 'next/server';

export async function GET() {
  const wsPort = process.env.WS_PORT || '3001';
  const wsHost = process.env.WS_HOST || 'localhost';

  return NextResponse.json({
    wsUrl: `ws://${wsHost}:${wsPort}`,
    status: 'available',
    message: 'Connect to the WebSocket server for real-time pipeline updates',
  });
}
