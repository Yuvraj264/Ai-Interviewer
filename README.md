# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 5 — Interview State Machine & Interview Engine

The repository is currently at **Phase 5 (Interview State Machine & Interview Engine)**. The system enforces a deterministic, environment-independent interview state machine (`@ai-interviewer/interview-engine`) that controls interview stages (`INTRO` -> `BACKGROUND` -> `PROJECT_DEEP_DIVE` -> `TECHNICAL` -> `BEHAVIORAL` -> `CLOSING`), question lifecycles, time limits, topic tracking, and question budgets. **The LLM does NOT own interview state**—it delivers conversational voice responses for engine-selected questions.

---

## System Architecture (Phase 5)

```text
Candidate Speech
       ↓
Browser Microphone (WebRTC)
       ↓
LiveKit Room ◄───────► Realtime Agent (apps/agent)
                            │
                    Interview Engine (@ai-interviewer/interview-engine)
                            │
                    Deterministic State Machine
                    (Stages, Question Budget, Time Limit)
                            │
                    OpenAI Realtime (gpt-4o-realtime-preview)
                    (Conversational Phrasing Only)
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

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 5)

- Adaptive difficulty scaling based on answer quality (Phase 6)
- Candidate scoring & hiring recommendation report (Phase 8)
- Resume & Job Description intelligence
- Recruiter analytics dashboard
