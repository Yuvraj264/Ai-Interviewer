# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 1 — Repository Foundation

The repository is currently at **Phase 1 (Repository Foundation)**. Infrastructure and workspace scaffolding are operational. Business logic, AI model connections, and audio streaming are intentionally omitted at this phase.

---

## Architecture Overview

```text
ai-interviewer/
│
├── apps/
│   ├── web/           # Next.js 14 App Router web client
│   ├── api/           # NestJS API service exposing GET /health
│   └── agent/         # Node.js / TypeScript LiveKit Agent runner shell
│
├── packages/
│   ├── shared/        # System contracts, types, and constants
│   ├── interview-engine/ # State machine placeholder shell
│   └── config/        # Environment schema validation (Zod)
│
├── infra/
│   └── docker-compose.yml # PostgreSQL 16 + Valkey 7.2 local services
│
├── flow.md            # Execution workflow and status log
├── context.md         # Architecture record
├── package.json       # Root monorepo configuration
├── pnpm-workspace.yaml# pnpm workspace definition
└── turbo.json         # Turborepo task pipeline configuration
```

---

## Prerequisites

- **Node.js**: `>= 18.0.0`
- **pnpm**: `>= 8.0.0` (`pnpm -v`)
- **Docker & Docker Compose**: Installed and running

---

## Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

---

## Environment Setup

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

---

## Starting Local Infrastructure (PostgreSQL & Valkey)

Launch PostgreSQL 16 and Valkey using Docker Compose:

```bash
# Start infrastructure containers
docker compose up -d

# Stop infrastructure containers
docker compose down
```

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

### Run Tests
```bash
pnpm test
```

### Build Production Bundle
```bash
pnpm build
```

---

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 1)

- OpenAI API & Realtime model connections
- LiveKit rooms & WebRTC audio streaming
- Microphone / Browser audio capture
- Candidate interview state machine & adaptive questioning
- Database models, migrations, & persistence schemas
- Authentication & payment gateways
