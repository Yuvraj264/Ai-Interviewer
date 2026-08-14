# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 9 — Recruiter Dashboard & Interview Analytics

The repository is currently at **Phase 9 (Recruiter Dashboard & Interview Analytics)**. The system features a recruiter-facing **Recruiter Intelligence Workspace** (`/recruiter`) supported by server-side analytics (`AnalyticsService`) and REST API endpoints (`DashboardController`). Recruiters can view operational metrics, search candidates, inspect experience claim verifications, navigate turn-by-turn transcripts, explore visual adaptive flow diagrams, inspect observable evidence with click-to-transcript drill-down, and perform human review overrides. **The system is strictly an Interview Intelligence Workspace—it NEVER generates autonomous hiring decisions (`HIRE`/`REJECT`) or candidate rankings**.

---

## System Architecture (Phase 9)

```text
Dashboard REST Endpoints (DashboardController) ──► AnalyticsService ──┐
                                                                       ├──► Recruiter Intelligence Workspace (/recruiter)
Interview Sessions & Evaluations ─────────────────► Server Aggregation ┘          │
                                                                                  ▼
                                                                      Overview / Candidates / Interviews / Analytics
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
- `GET  /dashboard/overview`: Fetch operational overview metrics
- `GET  /dashboard/candidates`: Paginated candidate directory with search & claim badges
- `GET  /dashboard/candidates/:id`: Candidate detail with job matches
- `GET  /dashboard/interviews`: Paginated interview list with status filter
- `GET  /dashboard/interviews/:id`: Detailed interview workspace data
- `GET  /dashboard/jobs`: Job description listings
- `GET  /dashboard/analytics`: Operational, AI behavior, evaluation, and requirement analytics

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

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 9)

- Production load testing & multi-region deployment manifests (Phase 10)
- ATS / HRIS candidate auto-export
