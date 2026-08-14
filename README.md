# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 10 — Production Hardening, Load Testing & Deployment

The repository is currently at **Phase 10 (Production Hardening, Load Testing & Deployment)**. The system is hardened for production concurrency, security, observability, and resilience using a modular monolith containerized architecture.

---

## Key Production Features (Phase 10)

- **Fail-Fast Startup Validation**: Startup checks (`packages/config`) validate production credentials (`DATABASE_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `OPENAI_API_KEY`) at boot time.
- **Structured JSON Logging & PII Redaction**: `StructuredLoggerService` emits JSON logs with correlation IDs (`X-Correlation-ID`) while sanitizing candidate PII, transcripts, tokens, and keys.
- **Liveness & Deep Readiness Probes**:
  - `GET /health`: Liveness status & uptime.
  - `GET /health/readiness`: Deep dependency health check (PostgreSQL, Redis, LiveKit WebRTC).
- **Graceful Shutdown**: Listens to `SIGTERM` / `SIGINT` to drain requests and cleanly close database and Redis pools.
- **Rate Limiting & Security Hardening**: Helmet security headers, CORS origin restrictions, and rate-limiting guard (120 req/min).
- **Realtime WebRTC Resilience**: `handleReconnection()` auto-reconnects and recovers session state on WebRTC network dropouts.
- **Load Testing & Benchmarking Suite**: `LoadTester` (`infra/load-tests/benchmark.ts`) evaluating concurrency, RPS, `p50`/`p95`/`p99` latency, and error rates.
- **Production Containerization**: Multi-stage `Dockerfile` executing under a non-root `node` user, `.dockerignore`, and `RUNBOOK.md`.

---

## Development & Production Commands

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

### Run Production Container Build
```bash
docker build -t ai-interviewer:v1.0.0 .
```

---

## Operational Documentation

Refer to [`RUNBOOK.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/RUNBOOK.md) for complete operational procedures, health probes, incident response, rollbacks, and database backups.
