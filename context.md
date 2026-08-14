# Technical Context & Architectural Record

## System Overview
The AI Interviewer platform is a production-oriented system for conducting real-time voice-based candidate interviews.

---

## Phase 1 Implementation Record

### What Was Built
1. **Monorepo Architecture**: pnpm workspaces + Turborepo monorepo structure separating applications (`apps/`) and reusable packages (`packages/`).
2. **`apps/web`**: Next.js 14 App Router application.
3. **`apps/api`**: NestJS HTTP server providing health monitoring via `GET /health`.
4. **`apps/agent`**: Node.js/TypeScript background worker shell.
5. **`packages/shared`**: Centralized TypeScript types.
6. **`packages/interview-engine`**: Engine module placeholder.
7. **`packages/config`**: Centralized environment variable validation using `zod`.
8. **`infra/`**: Local development infrastructure via Docker Compose (PostgreSQL 16 and Valkey).

---

## Phase 2 Implementation Record

### What Was Built
1. **Shared Session Contracts (`packages/shared`)**: Defined `SessionStatus`, `InterviewStage`, `InterviewType`, `InterviewSession` contracts, and `createSessionSchema` using Zod.
2. **Mock Interviewer Engine (`packages/interview-engine`)**: Created `InterviewInteractionProvider` contract and `MockInterviewer` engine providing deterministic Q&A flows.
3. **Server-Authoritative REST API (`apps/api`)**: Developed `InterviewsService` and `InterviewsController` exposing endpoints: `POST /interviews`, `GET /interviews/:id`, `POST /interviews/:id/start`, and `POST /interviews/:id/end`.
4. **Candidate UI Flow (`apps/web`)**: Implemented `LandingView`, `SetupForm`, `WaitingRoom`, `InterviewShell`, `SessionTimer`, `EndInterviewDialog`, `CompletionScreen`, `ErrorMessage`, and `Session Recovery`.

---

## Phase 3 Implementation Record

### What Was Built
1. **Backend Token Authorization (`apps/api`)**: Built `RealtimeService` using `livekit-server-sdk` (v2.x) exposing `POST /interviews/:id/realtime/token`. Validates session status and generates short-lived JWT tokens (30m TTL).
2. **WebRTC Media Transport (`apps/web`)**: Integrated `livekit-client` (v2.x) and custom hook `useRealtimeAudio` for user-initiated microphone permission, room connection (`interview:{sessionId}`), track publication, and connection state handling (`DISCONNECTED`, `CONNECTING`, `CONNECTED`, `RECONNECTING`, `FAILED`).
3. **Agent Realtime Participant (`apps/agent`)**: Updated `AgentWorker` to join rooms as participant identity `agent-{sessionId}`, monitoring track events and participant presence cleanly.
4. **UI Realtime Dashboard (`apps/web`)**: Enhanced `InterviewShell` with WebRTC connection badge, microphone indicator, agent presence status, and error fallback alert.

### Architectural Decisions
- **Why LiveKit Was Selected**: Handles low-latency WebRTC media transport, room management, and participant presence out-of-the-box without requiring custom WebRTC signaling servers.
- **Direct WebRTC Media Path**: Candidate browser connects directly to LiveKit Server. Media bytes bypass the NestJS API server completely, ensuring zero server media relay overhead.
- **Backend Token Generation**: `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` remain strictly on the backend. The browser receives only short-lived JWT participant tokens.
- **Deterministic Room & Identity Strategy**:
  - Room Name: `interview:{sessionId}`
  - Candidate Identity: `candidate-{sessionId}`
  - Agent Identity: `agent-{sessionId}`
- **Audio Privacy**: Audio is transported live; no audio recording, egress, or S3 uploads are enabled in Phase 3.

### Dependencies Added
- `livekit-server-sdk` (`v2.3.0`) in `apps/api`
- `livekit-client` (`v2.1.3`) in `apps/web` and `apps/agent`

### Testing & Verification
- Unit tests for backend token generation, agent participant room joining, shared contracts, and frontend hook.
- Verification passed for `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

### Known Limitations
Phase 3 establishes realtime audio transport only. It explicitly does **NOT** contain:
- OpenAI API or OpenAI Realtime model connections
- Speech-to-Text (STT) or Text-to-Speech (TTS)
- AI-generated responses or adaptive question logic
- Candidate evaluation scoring or audio recording uploads

### Next Phase
**Phase 4 — First End-to-End Voice Interview**
