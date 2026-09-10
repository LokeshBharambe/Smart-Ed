#!/bin/bash
echo ""
echo "  🎓  Smart-ED — AI Learning Platform"
echo "  ───────────────────────────────────"
echo ""

# Check node
if ! command -v node &>/dev/null; then
  echo "  ❌  Node.js not found. Install from https://nodejs.org"
  exit 1
fi

# Install deps if needed
if [ ! -d "backend/node_modules" ]; then
  echo "  📦  Installing dependencies..."
  cd backend && npm install && cd ..
  echo "  ✅  Dependencies installed"
fi

echo "  🚀  Starting server on http://localhost:3001"
echo ""
echo "  Demo accounts:"
echo "  👨‍🎓  Student  →  student@demo.com / demo123"
echo "  👩‍🏫  Teacher  →  teacher@demo.com / demo123"
echo ""
echo "  Press Ctrl+C to stop"
echo ""

node backend/server.js
