# Technical Context & Architectural Record

## System Overview
The AI Interviewer platform is a production-oriented system for conducting real-time voice-based candidate interviews.

---

## Phase 1 Implementation Record

### What Was Built
1. **Monorepo Architecture**: pnpm workspaces + Turborepo monorepo structure separating applications (`apps/`) and reusable packages (`packages/`).
2. **`apps/web`**: Next.js 14 App Router application displaying system foundation status.
3. **`apps/api`**: NestJS HTTP server providing health monitoring via `GET /health`.
4. **`apps/agent`**: Node.js/TypeScript background worker shell for future LiveKit agent integration.
5. **`packages/shared`**: Centralized TypeScript types (`SystemHealth`, `ApiResponse`) and phase constants.
6. **`packages/interview-engine`**: Engine module placeholder for future state machine.
7. **`packages/config`**: Centralized environment variable validation using `zod`.
8. **`infra/`**: Local development infrastructure via Docker Compose (PostgreSQL 16 and Valkey).

### Why Each Component Was Introduced
- **pnpm + Turborepo**: Provides fast, deterministic monorepo dependency resolution and cached workspace task execution (`build`, `lint`, `test`, `typecheck`).
- **Next.js (`apps/web`)**: Provides modern React-based SSR/SSG frontend capability for candidate interview interface and recruiter view.
- **NestJS (`apps/api`)**: Enterprise Node.js framework for robust backend services, persistence APIs, and auth integrations.
- **Node.js Agent Shell (`apps/agent`)**: Dedicated entry point for high-concurrency realtime voice processing via LiveKit Agents without polluting HTTP API server bounds.
- **Config Package (`packages/config`)**: Prevents untyped `process.env` access throughout application code by validating environment schema at startup.

### Technology Decisions & Versions
- **Package Manager**: pnpm `11.21.0`
- **Monorepo Orchestration**: Turborepo `2.0.0`
- **TypeScript**: `5.4.5` (Strict mode enforced)
- **Frontend Framework**: Next.js `14.2.3` / React `18.3.1`
- **Backend Framework**: NestJS `10.3.8`
- **Testing Engine**: Vitest `1.6.0`
- **Validation**: Zod `3.23.8`
- **Database Infrastructure**: PostgreSQL `16-alpine`
- **Cache/Queue Infrastructure**: Valkey `7.2-alpine`

### Dependencies Added
- `turborepo` — Workspace build orchestration
- `typescript` — Strict type system
- `eslint` & `@typescript-eslint` — Static code analysis
- `prettier` — Automated code formatting
- `vitest` — Fast unit and smoke testing framework
- `zod` & `dotenv` — Type-safe configuration management
- `next`, `react`, `react-dom` — Web UI framework
- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` — Backend framework
- `tsup` — Fast TypeScript package builder for internal workspace packages

### Environment Configuration
Centralized configuration is exposed via `@ai-interviewer/config`. `.env.example` at the root lists all expected parameters (`PORT`, `API_PORT`, `DATABASE_URL`, `VALKEY_URL`, etc.). Applications load and validate environment variables before launching.

### Infrastructure
Local infrastructure runs via Docker Compose (`docker-compose up -d`):
- **PostgreSQL**: Port 5432, container `ai_interviewer_postgres`, database `ai_interviewer_dev`.
- **Valkey**: Port 6379, container `ai_interviewer_valkey`.

### Testing Strategy
- Unit tests in `packages/shared`, `packages/config`, `packages/interview-engine`, `apps/api`, and `apps/agent`.
- Configured via root `vitest.config.ts`.

### Verification Status
- **lint**: PASS
- **typecheck**: PASS
- **test**: PASS
- **build**: PASS

### Known Limitations
Phase 1 is engineering infrastructure only. It explicitly does **NOT** contain:
- OpenAI API calls or OpenAI Realtime integration
- LiveKit WebRTC audio rooms or agent connections
- Microphone or browser audio capture
- Interview state machines, question generation, or scoring logic
- Candidate database tables, migrations, or authentication

### Next Phase
**Phase 2 — Candidate Interview Shell**
