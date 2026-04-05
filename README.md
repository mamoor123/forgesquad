# ForgeSquad

> A multi-agent dev team orchestrator — plan, review, code, and test with a 5-agent pipeline.

**The "Plan is the Code Contract" philosophy** — the Planner writes complete code in the plan, the Reviewer challenges it, the Coder implements, and the Tester verifies.

![Deep Space Theme](https://img.shields.io/badge/theme-deep%20space-blueviolet)
![Node](https://img.shields.io/badge/node-22%2B-339933)
![Next.js](https://img.shields.io/badge/next.js-14-black)
![License](https://img.shields.io/badge/license-MIT-green)

## The Team

| Agent | Role | Color |
|-------|------|-------|
| **Supervisor** | Oversees the team, captures concepts | Cyan |
| **Planner** | Researches and writes complete build plans | Emerald |
| **Reviewer** | Challenges plans, sends structured questions | Amber |
| **Coder** | Implements the locked plan exactly | Violet |
| **Tester** | Verifies code against plan, runs tests | Rose |

## Quick Start

```bash
git clone https://github.com/mamoor123/forgesquad.git
cd forgesquad
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the **Office View** or [http://localhost:3000/squad](http://localhost:3000/squad) for the **Squad View**.

## Pipeline

```
Concept → Plan → Review → Code → Test → Done
          ↑      ↓         ↑      ↓
          Plan-Review Loop  Code-Test Loop
```

## Views

### Office View (`/`)
Full mission control dashboard with:
- CSS agent visualization with animated connection lines
- Phase progress tracker
- 2×2 agent panel grid with live output
- Real-time event feed
- Start/Stop/Reset controls

### Squad View (`/squad`)
Calmer supervisor-first workspace:
- Main chat with Supervisor
- Tab switcher to any specialist
- Same runtime, simpler UI

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** for animations
- **WebSocket** (ws) for real-time updates
- **Lucide React** for icons

## License

MIT
