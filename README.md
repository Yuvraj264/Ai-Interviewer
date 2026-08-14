# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 6 — Adaptive Questioning Engine

The repository is currently at **Phase 6 (Adaptive Questioning Engine)**. The system features an evidence-grounded adaptive questioning pipeline (`@ai-interviewer/interview-engine/adaptive`) that dynamically analyzes candidate answers for technical depth, missing concepts, and evidence claims to propose adaptive actions (`FOLLOW_UP`, `PROBE`, `CLARIFY`, `INCREASE_DIFFICULTY`, `DECREASE_DIFFICULTY`, `NEW_TOPIC`). **The LLM does NOT directly modify interview state**—all proposals are validated by the deterministic `InterviewEngine` with mandatory fallback guarantees.

---

## System Architecture (Phase 6)

```text
Candidate Speech
       ↓
Browser Microphone (WebRTC)
       ↓
LiveKit Room ◄───────► Realtime Agent (apps/agent)
                            │
                    Adaptive Questioning Engine
                    (Answer Analysis -> Evidence Extraction -> Adaptive Decision)
                            │
                    Interview Engine Validation & Difficulty Bounds Check
                    (Stages, Question Budget, Difficulty Rules)
                            │
                    OpenAI Realtime (gpt-4o-realtime-preview)
                    (Conversational Voice Phrasing)
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

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 6)

- Resume & Job Description intelligence (Phase 7)
- Candidate scoring & recruiter evaluation report (Phase 8)
- Recruiter analytics dashboard
