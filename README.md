# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 11 — Founder Demo, Product Excellence & AI Interview Quality

The repository is currently at **Phase 11 (Founder Demo, Product Excellence & AI Interview Quality)**. The system features a guided **Founder Demo Mode**, synthetic demo candidate **Alex Mercer**, REST demo seeding endpoint (`POST /demo/reset`), AI Quality Test Suite (`DemoQualitySuite`), 5-minute [`DEMO_SCRIPT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/DEMO_SCRIPT.md), and [`DEMO_CHECKLIST.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/DEMO_CHECKLIST.md).

---

## Key Founder Demo Highlights

- **Resume & Job Personalization**: AI interviewer grounds questions in candidate claims (Alex Mercer, PrimeBank microservices, PostgreSQL indexing, Redis caching) without fabricating un-claimed experience.
- **Adaptive Probe vs Scripted Bot**: AI detects candidate evidence claims, identifies evidence gaps, and selects focused follow-ups dynamically (`STRONG ANSWER` -> `DEEPER FOLLOW-UP`, `WEAK ANSWER` -> `CLARIFIES/PROBES`).
- **Evidence Explorer Drill-Down**: Recruiter clicks evidence card -> navigates directly to exact transcript turn.
- **AI Quality Test Suite**: `DemoQualitySuite` (`packages/interview-engine/src/demo/quality-suite.ts`) verifying personalization, repetition prevention, contradiction detection (`CONTRADICTORY`), candidate question recognition, and demographic fairness.
- **Isolated Demo Seeding Endpoint**: `POST /demo/reset` idempotently seeds synthetic candidate Alex Mercer and Senior Backend Engineer job description.

---

## Development & Production Commands

### Start All Development Applications
```bash
pnpm dev
```

### Reset Founder Demo Environment
```bash
curl -X POST http://localhost:3001/demo/reset
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

## Guided Demo Documentation

- Refer to [`DEMO_SCRIPT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/DEMO_SCRIPT.md) for the 5-minute guided founder demo script.
- Refer to [`DEMO_CHECKLIST.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/DEMO_CHECKLIST.md) for pre-flight live demo readiness checks.
- Refer to [`RUNBOOK.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/RUNBOOK.md) for operational deployment procedures.
