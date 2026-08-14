# Execution Flow & Phase Status Log

## Project Roadmap Status

### Phase 0 — Architecture & Guardrails
**Status**: COMPLETED

### Phase 1 — Repository Foundation
**Status**: COMPLETED

### Phase 2 — Candidate Interview Shell
**Status**: COMPLETED

### Phase 3 — Realtime Audio Foundation
**Status**: COMPLETED

### Phase 4 — Adaptive Interview Logic & Scoring
**Status**: NOT STARTED

---

## Phase 3 Implementation Log

### Phase 3 Entry Point
```text
Phase 2 completed
       ↓
Candidate interview session exists
       ↓
Realtime transport introduced
```

### Phase 3 Realtime Workflow

```text
Interview Session Started (IN_PROGRESS)
       ↓
Request realtime token (POST /interviews/:id/realtime/token)
       ↓
Backend validates session & generates short-lived JWT token
       ↓
Browser receives token & requests microphone permission
       ↓
Browser connects to LiveKit Room (interview:{sessionId})
       ↓
Browser publishes local microphone audio track
       ↓
Agent Participant (agent-{sessionId}) connects & joins room
       ↓
Realtime WebRTC connection established (Connected)
       ↓
Candidate can end interview / reconnect on network glitch
```

### Backend Entry Points Implemented
- `POST /interviews/:id/realtime/token`: Generates LiveKit participant JWT tokens with short TTL (30 mins) and least-privilege grants (`roomJoin`, `canPublish`, `canSubscribe`).

### Frontend Entry Points & Hooks
- `useRealtimeAudio`: Manages LiveKit room connection, microphone permission (`getUserMedia`), track publication, connection state (`DISCONNECTED` | `CONNECTING` | `CONNECTED` | `RECONNECTING` | `FAILED`), agent presence, and device error handling.
- `InterviewShell`: Displays realtime connection status badge, microphone status, agent presence indicator, and error fallback card.

### Realtime Events & Logs
- `realtime.token.created`: Generated short-lived JWT token for room `interview:{sessionId}`.
- `realtime.connection.connected`: LiveKit WebRTC room connection established.
- `realtime.connection.reconnecting`: Automatic connection recovery in progress.
- `realtime.microphone.enabled`: Published local microphone audio track.
- `realtime.agent.joined`: Agent participant (`agent-{sessionId}`) joined room.
- `realtime.agent.left`: Agent participant disconnected cleanly.

### Phase 3 Exit Point
A robust WebRTC audio transport foundation is operational end-to-end:
- Candidate browser requests microphone permission and connects directly to LiveKit Room `interview:{sessionId}`.
- Backend handles JWT token authorization without exposing API secrets (`LIVEKIT_API_KEY`/`LIVEKIT_API_SECRET`) to the frontend.
- LiveKit Agent worker connects as participant `agent-{sessionId}`.
- Zero AI model calls, STT, or TTS are executed in Phase 3. The transport layer is validated and decoupled for Phase 4.

### Files Added/Modified in Phase 3
- `packages/config/src/index.ts`
- `packages/config/src/index.test.ts`
- `packages/shared/src/index.ts`
- `packages/shared/src/index.test.ts`
- `apps/api/package.json`
- `apps/api/src/interviews/realtime.service.ts`
- `apps/api/src/interviews/realtime.service.spec.ts`
- `apps/api/src/interviews/interviews.controller.ts`
- `apps/api/src/interviews/interviews.controller.spec.ts`
- `apps/api/src/app.module.ts`
- `apps/agent/package.json`
- `apps/agent/src/index.ts`
- `apps/agent/src/index.spec.ts`
- `apps/web/package.json`
- `apps/web/src/lib/api-client.ts`
- `apps/web/src/hooks/useRealtimeAudio.ts`
- `apps/web/src/components/InterviewShell.tsx`
- `apps/web/src/app/page.test.tsx`
- `flow.md`
- `context.md`
- `README.md`

### Verification Summary
- `pnpm lint`: PASS
- `pnpm typecheck`: PASS
- `pnpm test`: PASS
- `pnpm build`: PASS
