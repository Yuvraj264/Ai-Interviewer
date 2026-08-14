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

---

## Phase 2 Implementation Record

### What Was Built
1. **Shared Session Contracts (`packages/shared`)**: Defined `SessionStatus`, `InterviewStage`, `InterviewType`, `InterviewSession` contracts, and `createSessionSchema` using Zod for client/server validation.
2. **Mock Interviewer Engine (`packages/interview-engine`)**: Created `InterviewInteractionProvider` contract and `MockInterviewer` engine providing deterministic Q&A flows for technical, behavioral, and mixed interviews.
3. **Server-Authoritative REST API (`apps/api`)**: Developed `InterviewsService` and `InterviewsController` exposing endpoints: `POST /interviews`, `GET /interviews/:id`, `POST /interviews/:id/start`, and `POST /interviews/:id/end`.
4. **Candidate UI Flow (`apps/web`)**:
   - `LandingView`: Candidate introduction card.
   - `SetupForm`: Validated form capturing candidate parameters.
   - `WaitingRoom`: Pre-interview summary & start trigger.
   - `InterviewShell`: Core Q&A screen with header, server-synced countdown timer (`SessionTimer`), progress bar, mock questions, and response buttons.
   - `EndInterviewDialog`: Modal dialog confirming early or final conclusion.
   - `CompletionScreen`: Conclusion view stating responses are recorded for evaluation.
   - `ErrorMessage`: Accessible error display for 404 or connection failures.
   - `Session Recovery`: Browser refresh on `/interview/[sessionId]` fetches authoritative state from `GET /interviews/:id` and restores exact UI view.

### Architectural Reasoning
- **UI Decoupling**: React components consume `InterviewInteractionProvider` rather than implementing interview state machine logic directly. This allows swapping `MockInterviewer` with LiveKit Realtime Agent in Phase 3 without altering the UI.
- **Server-Authoritative Session State**: The server owns status (`CREATED`, `IN_PROGRESS`, `COMPLETED`) and timestamps (`startedAt`, `completedAt`). The client cannot forge completion or timer values.
- **Why Mock Interviewer Exists**: Decouples UI candidate experience validation from complex AI/WebRTC infrastructure, enabling fast testing of session lifecycle.

### API Architecture
- `POST /interviews`: Validates input with `createSessionSchema`, creates session ID (`sess_<timestamp>_<random>`), returns session object.
- `GET /interviews/:id`: Returns session or 404 error.
- `POST /interviews/:id/start`: Transitions state from `CREATED`/`WAITING` -> `IN_PROGRESS` and records `startedAt`.
- `POST /interviews/:id/end`: Transitions state to `COMPLETED` and records `completedAt`.

### Testing & Verification
- Unit tests in `packages/shared`, `packages/interview-engine`, `apps/api`, and `apps/web`.
- Verification passed for `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

### Security Considerations
- Session IDs use unique random suffixes (`sess_<timestamp>_<hash>`).
- Client cannot set status, stage, or start/completed timestamps directly; status transitions are enforced by `InterviewsService`.

### Known Limitations
Explicitly deferred to future phases:
- No real microphone audio access
- No WebRTC or LiveKit rooms
- No OpenAI or OpenAI Realtime APIs
- No STT (Speech-to-Text) or TTS (Text-to-Speech)
- No adaptive AI question generation or candidate evaluation scoring

### Next Phase
**Phase 3 — Realtime Audio Foundation**
