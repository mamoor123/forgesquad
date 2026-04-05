#!/bin/bash
# ForgeSquad development startup script

set -e

echo "🔧 ForgeSquad Dev Environment"
echo "=============================="

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
  echo "⚠️  Node.js 22+ recommended (found v$NODE_VERSION)"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start both Next.js and WebSocket server
echo "🚀 Starting ForgeSquad..."
echo ""
echo "  Dashboard: http://localhost:3000"
echo "  Squad:     http://localhost:3000/squad"
echo "  WebSocket: ws://localhost:3001"
echo ""

npm run dev
