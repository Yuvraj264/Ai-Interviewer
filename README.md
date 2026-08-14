# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 8 — Evidence-Based Interview Evaluation

The repository is currently at **Phase 8 (Evidence-Based Interview Evaluation)**. The system features a post-interview evidence evaluation engine (`@ai-interviewer/interview-engine/evaluation`) that evaluates observable transcript evidence against configurable role rubrics (`BACKEND_ENGINEER_RUBRIC_V1`), enforces **NO EVIDENCE = NO SCORE**, maps job requirement coverage (`SUPPORTED`, `PARTIALLY_TESTED`, `NOT_TESTED`), and supports human reviewer overrides with immutable audit trails. **The system is strictly an Interview Evaluation Assistant—it NEVER generates autonomous hiring decisions (`HIRE`/`REJECT`)**.

---

## System Architecture (Phase 8)

```text
Completed Interview Transcript ──► EvidenceEvaluator (EVALUATION_ENGINE_V1) ──┐
                                                                              ├──► HumanReviewService
Job Profile Requirements ─────────► Requirement Coverage Mapping ─────────────┘          │
                                                                                         ▼
                                                                             Structured Assessment Report
                                                                                         │
                                                                                         ▼
                                                                            Human Reviewer Sign-Off
```

---

## API Endpoints

- `GET  /health`: Health monitoring & system phase check
- `POST /interviews`: Create candidate interview session
- `GET  /interviews/:id`: Retrieve session status
- `POST /interviews/:id/start`: Transition session status to `IN_PROGRESS`
- `POST /interviews/:id/end`: Transition session status to `COMPLETED`
- `POST /interviews/:id/realtime/token`: Issue short-lived LiveKit participant JWT token
- `POST /interviews/:id/resume`: Upload & parse candidate resume
- `POST /interviews/:id/jd`: Upload/paste & parse job description
- `GET  /interviews/:id/profile`: Retrieve parsed candidate profile, job profile, and match summary
- `POST /interviews/:id/prepare`: Prepare interview targets and precomputed context snapshot
- `POST /interviews/:id/evaluate`: Trigger evidence-based post-interview evaluation
- `GET  /interviews/:id/evaluation`: Retrieve structured evaluation and requirement coverage
- `POST /interviews/:id/evaluation/review`: Submit human reviewer overrides and audit notes

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

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 8)

- Recruiter analytics dashboard & candidate comparison (Phase 9)
- Cheating detection
