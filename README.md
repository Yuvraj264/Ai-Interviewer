# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 3 — Realtime Audio Foundation

The repository is currently at **Phase 3 (Realtime Audio Foundation)**. WebRTC audio transport via LiveKit connects the candidate's browser microphone directly to a LiveKit Agent participant in the room `interview:{sessionId}` with backend JWT token authorization. OpenAI Realtime conversational models and STT/TTS pipelines remain deferred to Phase 4.

---

## Realtime Audio Architecture (Phase 3)

```text
                         ┌──────────────────────┐
                         │     Next.js Web      │
                         │                      │
                         │ Candidate Interview  │
                         │       Screen         │
                         └──────────┬───────────┘
                                    │
                              WebRTC Audio
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       LiveKit        │
                         │      Room/Server     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Agent Worker       │
                         │                      │
                         │ Realtime Participant │
                         └──────────────────────┘

                         (No AI Models in Phase 3)
```

---

## API Endpoints (Phase 3)

- `GET  /health`: Health monitoring & system phase check
- `POST /interviews`: Create candidate interview session
- `GET  /interviews/:id`: Retrieve session status (supports session recovery on refresh)
- `POST /interviews/:id/start`: Transition session status to `IN_PROGRESS`
- `POST /interviews/:id/end`: Transition session status to `COMPLETED`
- `POST /interviews/:id/realtime/token`: Issue short-lived LiveKit participant JWT token for room `interview:{sessionId}`

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

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 3)

- OpenAI API & Realtime model connections
- Speech-to-Text (STT) or Text-to-Speech (TTS)
- Adaptive AI question generation & candidate evaluation scoring
- Audio recording or S3 egress storage
- Candidate database tables, migrations, & authentication
