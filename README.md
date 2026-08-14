# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 4 — First End-to-End Voice Interview

The repository is currently at **Phase 4 (First End-to-End Voice Interview)**. Candidates can engage in a natural, multi-turn, two-way spoken conversation with an AI interviewer powered by OpenAI Realtime (`gpt-4o-realtime-preview`) and LiveKit WebRTC audio transport, with interruption/barge-in support, concise responses (1–3 sentences), live transcripts, and latency tracking.

---

## Voice Interview Architecture (Phase 4)

```text
Candidate Speaker ◄─────── WebRTC ───────┐
                                          │
Candidate Microphone ────► WebRTC ────► LiveKit Room
                                          │
                                          ▼
                                   Agent Worker
                                          │
                                  OPENAI_API_KEY
                                  (Server-Only)
                                          │
                                          ▼
                                  OpenAI Realtime
                               (gpt-4o-realtime-preview)
```

---

## API Endpoints

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

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 4)

- Adaptive interview state machine & scoring
- Resume intelligence & Job Description intelligence
- Recruiter dashboard & candidate ranking
- Persistent audio recording & S3 uploads
