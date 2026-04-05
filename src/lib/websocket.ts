// Standalone WebSocket server for real-time pipeline updates

import { WebSocketServer, WebSocket } from 'ws';

const PORT = parseInt(process.env.WS_PORT || '3001', 10);

const wss = new WebSocketServer({ port: PORT });

const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`[WS] Client connected. Total: ${clients.size}`);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      // Broadcast to all other clients
      clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(msg));
        }
      });
    } catch (e) {
      console.error('[WS] Invalid message:', e);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected. Total: ${clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Error:', err);
    clients.delete(ws);
  });

  // Send welcome
  ws.send(JSON.stringify({
    type: 'status_update',
    agent: 'S',
    phase: 'idle',
    payload: { message: 'Connected to ForgeSquad pipeline' },
    timestamp: Date.now(),
  }));
});

console.log(`[WS] ForgeSquad WebSocket server running on ws://localhost:${PORT}`);
