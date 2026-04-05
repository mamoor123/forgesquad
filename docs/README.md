# ForgeSquad

A web dashboard that orchestrates a 5-agent dev team to plan, review, code, and test software projects.

## The "Plan is the Code Contract" Philosophy

The Planner writes complete code in the plan. The Reviewer challenges it. The Coder implements exactly what's specified. The Tester verifies against the approved plan.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for Office View or [http://localhost:3000/squad](http://localhost:3000/squad) for Squad View.

## The Team

| Member | Role | ID |
|--------|------|-----|
| **Supervisor** | Oversees the team, captures concepts | S |
| **Planner** | Researches and writes complete build plans | A |
| **Reviewer** | Challenges plans, sends structured questions | B |
| **Coder** | Implements the locked plan exactly | C |
| **Tester** | Verifies code against plan, runs tests | D |

## Pipeline Phases

1. **Concept** — User describes what to build
2. **Plan** — Planner writes plan.md with complete code
3. **Review** — Reviewer challenges plan, loops until approved
4. **Code** — Coder implements the locked plan
5. **Test** — Tester verifies, loops with Coder until passing
6. **Done** — Build delivered

## Views

- **Office View** (`/`) — Full dashboard with mission control visualization, agent panels, live feed, and pipeline controls
- **Squad View** (`/squad`) — Calmer supervisor-first workspace with agent tab switching

## WebSocket Server

The dev script runs a WebSocket server on port 3001 for real-time pipeline updates. The dashboard connects automatically.

## License

MIT
