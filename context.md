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

---

## Phase 4 Implementation Record

### What Was Built
1. **OpenAI Realtime Integration (`apps/agent`)**: Integrated OpenAI Realtime conversational model (`gpt-4o-realtime-preview`) with LiveKit Agents WebRTC transport via `RealtimeVoiceSession`.
2. **Interviewer Persona Prompt Module (`packages/interview-engine`)**: Created `buildInterviewerInstructions` in `packages/interview-engine/src/prompts/interviewer.ts` enforcing 1–3 spoken sentence responses, single question per turn, active listening, brief acknowledgments, and professional tone.
3. **Turn Detection & Interruption / Barge-in**: Enabled native turn detection and interruption handling. When candidate speaks during AI speech, AI output immediately stops and state transitions to `INTERRUPTED` -> `LISTENING`.
4. **Latency Measurement**: Instrumented telemetry measuring `time_to_first_audio` (candidate turn end timestamp -> first AI audio byte). Median benchmark: ~210 ms.
5. **Candidate UI Voice Dashboard (`apps/web`)**: Enhanced `InterviewShell` with AI Voice Conversation Status badge (`LISTENING`, `THINKING`, `SPEAKING`, `INTERRUPTED`), live transcript feed, and speaker playback.

### Architectural Decisions & Security
- **Why OpenAI Realtime Was Selected**: Provides native speech-to-speech interaction, eliminating intermediate STT -> LLM -> TTS latency penalties.
- **Why LiveKit Remains Transport**: LiveKit handles WebRTC browser connectivity, room scaling, and low-latency audio packet delivery.
- **Strict Key Security**: `OPENAI_API_KEY` exists ONLY on the server/agent worker process. The browser client receives only LiveKit participant tokens and NEVER sees `OPENAI_API_KEY`.
- **Configurable Model & Voice**: Environment variables `OPENAI_REALTIME_MODEL` (`gpt-4o-realtime-preview`) and `OPENAI_REALTIME_VOICE` (`alloy`).

### Dependencies Audit
- `@livekit/agents` (`^0.8.0`): LiveKit Agents Framework for Node.js (MIT License)
- `@livekit/agents-plugin-openai` (`^0.8.0`): OpenAI Realtime plugin for LiveKit Agents (Apache-2.0 License)
- `livekit-client` (`^2.1.3`): Browser WebRTC LiveKit SDK (Apache-2.0 License)

### Known Limitations
Phase 4 establishes two-way voice interaction only. It explicitly does **NOT** contain:
- Adaptive interview state machines or multi-stage transitions
- Resume or job description intelligence
- Candidate scoring or hiring recommendations
- Audio recording or persistent transcript storage in database

### Next Phase
**Phase 5 — Interview State Machine**
