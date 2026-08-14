# AI Interviewer Platform — Production Operational Runbook

## Overview
This operational runbook documents deployment, health monitoring, incident response, rollback procedures, database backup/recovery, and load testing for the **AI Interviewer Platform**.

---

## 1. Environment & Configuration Management

### Fail-Fast Startup Checks
The system validates required environment variables at startup (`packages/config`). In `production` mode (`NODE_ENV=production`), the process will fail immediately if credentials are missing or set to default dev values.

### Environment Variable Checklist
- `NODE_ENV`: `production`
- `API_PORT`: `3001`
- `DATABASE_URL`: `postgresql://user:password@pg-host:5432/ai_interviewer_prod`
- `VALKEY_URL`: `redis://valkey-host:6379`
- `LIVEKIT_URL`: `wss://livekit.interviewer.scaler.com`
- `LIVEKIT_API_KEY`: Production API Key
- `LIVEKIT_API_SECRET`: Production API Secret
- `OPENAI_API_KEY`: Production OpenAI API Key

---

## 2. Health Monitoring & Observability

### Endpoint Liveness & Readiness
- **Liveness Probe**: `GET /health`
  - Returns `200 OK` with uptime seconds and service phase metadata.
- **Readiness Probe**: `GET /health/readiness`
  - Returns deep dependency status:
    ```json
    {
      "success": true,
      "data": {
        "status": "ok",
        "services": {
          "database": true,
          "redis": true,
          "livekit": true
        }
      }
    }
    ```

### Structured Logging & PII Redaction
All API logs emit JSON structured output. Correlation IDs (`X-Correlation-ID`) are attached to every request. Candidate emails, resume text, transcripts, tokens, and keys are automatically redacted (`[REDACTED]`).

---

## 3. Deployment Procedures

### Containerized Deployment (Docker)
1. Build production image:
   ```bash
   docker build -t ai-interviewer:v1.0.0 .
   ```
2. Run production container:
   ```bash
   docker run -d --name ai-interviewer-api \
     -p 3001:3001 \
     --env-file .env.production \
     ai-interviewer:v1.0.0
   ```

---

## 4. Rollback & Incident Response

### Application Rollback Strategy
1. If deployment fails readiness checks or experiences elevated error rates:
   ```bash
   docker stop ai-interviewer-api
   docker run -d --name ai-interviewer-api -p 3001:3001 --env-file .env.production ai-interviewer:previous-sha
   ```
2. Verify liveness and readiness:
   ```bash
   curl http://localhost:3001/health/readiness
   ```

### High CPU / Database Memory Saturation
1. Check process connection pools and active requests.
2. Verify rate-limiting guard status (120 req/min limit).

---

## 5. Database Backup & Recovery

### Automated Backup
- Daily pg_dump backup schedule:
  ```bash
  pg_dump -U postgres -h pg-host ai_interviewer_prod > backup_$(date +%Y%m%d).sql
  ```

### Non-Production Restore Procedure
1. Create temporary database:
   ```bash
   createdb -U postgres -h pg-host ai_interviewer_restore_test
   ```
2. Restore schema and data:
   ```bash
   psql -U postgres -h pg-host -d ai_interviewer_restore_test < backup_20260815.sql
   ```

---

## 6. Load Testing & Benchmarking

Execute the load test benchmark suite locally or in staging:
```bash
pnpm --filter @ai-interviewer/interview-engine test
```
Or run custom concurrency tests against staging endpoint:
```bash
node infra/load-tests/benchmark.ts
```
