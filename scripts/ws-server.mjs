// Standalone WebSocket server for development
// Run alongside Next.js: node scripts/ws-server.mjs

import { WebSocketServer, WebSocket } from 'ws';

const PORT = parseInt(process.env.WS_PORT || '3001', 10);
const wss = new WebSocketServer({ port: PORT });
const clients = new Set();

wss.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[WS] Port ${PORT} already in use. Set WS_PORT env var to change.`);
  } else {
    console.error('[WS] Server error:', err.message);
  }
  process.exit(1);
});

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected (${clients.size})`);

  ws.on('message', (data) => {
    try {
      const msg = data.toString();
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      });
    } catch (e) {
      console.error('[WS] Error:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected (${clients.size})`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Client error:', err.message);
    clients.delete(ws);
  });

  ws.send(JSON.stringify({
    type: 'status_update',
    agent: 'S',
    phase: 'idle',
    payload: { message: 'Connected to ForgeSquad pipeline' },
    timestamp: Date.now(),
  }));
});

console.log(`[WS] ForgeSquad WS server on ws://localhost:${PORT}`);
