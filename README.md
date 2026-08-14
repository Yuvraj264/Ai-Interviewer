# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 2 — Candidate Interview Shell

The repository is currently at **Phase 2 (Candidate Interview Shell)**. A candidate-facing interview experience is fully operational, powered by a deterministic **Mock Interviewer** service and server-authoritative session REST APIs. Realtime AI model connections and WebRTC audio streaming remain deferred to Phase 3/4.

---

## Candidate Flow (Phase 2)

```text
Landing Page
      ↓
Interview Setup Form
      ↓
Create Interview Session (POST /interviews)
      ↓
Waiting Room
      ↓
Start Interview (POST /interviews/:id/start)
      ↓
Interview Shell (Mock Engine Q&A + Progress + Countdown Timer)
      ↓
End Interview Confirmation Dialog
      ↓
Complete Interview (POST /interviews/:id/end)
      ↓
Completion Screen
```

---

## Architecture Overview

```text
ai-interviewer/
│
├── apps/
│   ├── web/                     # Next.js 14 candidate UI application (Port 3000)
│   ├── api/                     # NestJS backend APIs for session lifecycle (Port 3001)
│   └── agent/                   # Node.js / TypeScript LiveKit Agent runner shell
│
├── packages/
│   ├── shared/                  # Session contracts, schemas (Zod), and types
│   ├── interview-engine/        # MockInterviewer & InterviewInteractionProvider interface
│   └── config/                  # Centralized environment validation (Zod)
│
├── infra/
│   └── docker-compose.yml       # PostgreSQL 16 + Valkey 7.2 local services
│
├── flow.md                      # Execution workflow log
├── context.md                   # Technical context record
├── README.md                    # Root documentation
└── package.json                 # Monorepo root package.json
```

---

## API Endpoints (Phase 2)

- `GET  /health`: Health monitoring endpoint
- `POST /interviews`: Create candidate interview session
- `GET  /interviews/:id`: Retrieve session status (supports session recovery on refresh)
- `POST /interviews/:id/start`: Transition session status to `IN_PROGRESS`
- `POST /interviews/:id/end`: Transition session status to `COMPLETED`

---

## Development & Execution Commands

### Start All Development Applications
```bash
pnpm dev
```

### Run Linter
```bash
pnpm lint
```

### Run TypeScript Type Check
```bash
pnpm typecheck
```

### Run Unit Tests
```bash
pnpm test
```

### Build Production Bundle
```bash
pnpm build
```

---

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 2)

- OpenAI API & Realtime model connections
- LiveKit rooms & WebRTC audio streaming
- Microphone / Browser audio capture
- Speech-to-Text (STT) or Text-to-Speech (TTS)
- Adaptive AI question generation & candidate evaluation scoring
- Candidate database tables, migrations, & authentication
