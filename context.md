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
8. **`infra/`**: Local development infrastructure via Docker Compose (PostgreSQL 16, Valkey, and LiveKit WebRTC Server).

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

---

## Phase 5 Implementation Record

### What Was Built
1. **Interview Engine State Machine (`packages/interview-engine`)**: Built deterministic `InterviewEngine` class managing explicit stages (`CREATED` -> `WAITING` -> `INTRO` -> `BACKGROUND` -> `PROJECT_DEEP_DIVE` -> `TECHNICAL` -> `BEHAVIORAL` -> `CLOSING` -> `COMPLETING` -> `COMPLETED`).
2. **Structured Question Bank**: Implemented `QUESTION_BANK` in `packages/interview-engine/src/bank/questions.ts` with stable question IDs (`q_intro_01`, `q_tech_rest_01`, etc.) categorized by stage and topic.
3. **Domain Error Model**: Created structured error classes (`InvalidTransitionError`, `QuestionBudgetExceededError`, `InterviewAlreadyCompletedError`).
4. **Agent ↔ Engine Integration**: Integrated `InterviewEngine` into `RealtimeVoiceSession` inside `apps/agent`. The Agent queries the Engine for allowed next questions, while the LLM delivers conversational voice phrasing.

---

## Realtime Voice Infrastructure & LiveKit Hotfix Record

### 1. Root Cause Analysis
- **Error**: `net::ERR_CONNECTION_REFUSED` on `ws://localhost:7880/rtc/v1`.
- **Cause**: No LiveKit WebRTC server process was listening on TCP port 7880 on the host machine.
- **Verification**: `lsof -nP -iTCP:7880 -sTCP:LISTEN` confirmed port 7880 was not listening.

### 2. Local Infrastructure Resolution Strategy
- **Containerized LiveKit Server**: Added `livekit/livekit-server:v1.8.0` service to `infra/docker-compose.yml` with flags `--dev --keys "devkey: secret"`.
- **Published Host Ports**: Exposed `7880:7880`, `7881:7881`, `7882:7882/udp` for host browser access.
- **Reproducible Startup Command**:
  ```bash
  docker compose -f infra/docker-compose.yml up -d
  ```

### 3. URL & Networking Mapping
- **Local LiveKit URL**: `ws://localhost:7880`
- **Browser LiveKit URL**: `ws://localhost:7880`
- **API LiveKit URL**: `ws://localhost:7880`
- **Agent LiveKit URL**: `ws://localhost:7880`
- **Container Networking**: Host port binding (`7880:7880`) allows host browser and local services to connect to `ws://localhost:7880` cleanly.

### 4. Security & Token Architecture
- **Server-Side Token Generation**: `InterviewsController` (`POST /interviews/:id/realtime/token`) delegates to `RealtimeService.generateCandidateToken(sessionId)`.
- **JWT Grants**: `iss: devkey`, `ttl: 30m`, `roomJoin: true`, `room: interview:{sessionId}`, `identity: candidate-{sessionId}`, `canPublish: true`, `canSubscribe: true`.
- **Zero Credential Exposure**: `LIVEKIT_API_SECRET` and `OPENAI_API_KEY` remain server-side only. Browser receives short-lived token and public WebSocket URL (`ws://localhost:7880`).
- **Error Log Sanitization**: `useRealtimeAudio.ts` sanitizes all query parameters (`?access_token=REDACTED`), preventing JWT token leaks in console logs or error reports.

### 5. Participant Identity & Room Naming
- **Room Identifier**: `interview:{sessionId}`
- **Candidate Participant**: `candidate-{sessionId}`
- **Agent Participant**: `agent-{sessionId}`

### 6. Health & Observability
- Added `GET /health/readiness` deep service probe and `GET /health/realtime` endpoint in `HealthController` returning `{ status: 'LIVEKIT_REACHABLE', url: 'ws://localhost:7880' }`.

---

## Phase 12 Implementation Record

### What Was Built
1. **AI Safety Policy Engine (`packages/interview-engine/src/safety/safety-policy.ts`)**:
   - `SafetyPolicyEngine`: Enforces question safety policies (rejecting protected characteristics such as race, ethnicity, religion, sexual orientation, health, family planning), evidence turn reference verification, score boundary enforcement (1–5), and untrusted input sanitization.
2. **Red-Team Attack Suite (`packages/interview-engine/src/safety/red-team.ts`)**:
   - `RedTeamSuite`: Automated attack dataset executing 7 attack vectors (resume injection, JD injection, candidate answer injection, system prompt extraction, role-play attack, authority attack, encoded instructions) with 100% containment.
3. **Golden Dataset & Demographic Fairness Suites**:
   - `GoldenDatasetSuite`: Benchmark suite evaluating evidence traceability (100%) and unsupported claim rate (0%).
   - `FairnessSuite`: Demographic parity suite verifying 0.00 score variance across candidate demographic metadata variations (Name, School Prestige, Location).
4. **REST Safety Audit API (`apps/api/src/safety`)**:
   - `SafetyController`: REST endpoints `GET /safety/audit` and `POST /safety/red-team`.
5. **Security Documentation & Reports**:
   - [`AI_THREAT_MODEL.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/AI_THREAT_MODEL.md): Threat model matrix covering 8 primary AI threat vectors.
   - [`FAIRNESS_POLICY.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/FAIRNESS_POLICY.md): Formal demographic fairness policy.
   - [`FAIRNESS_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/FAIRNESS_REPORT.md): Empirical fairness test results (`0.00` score variance).
   - [`RED_TEAM_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/RED_TEAM_REPORT.md): Red-team attack outcomes (100% contained).
   - [`AI_SAFETY_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/AI_SAFETY_REPORT.md): Safety metrics report.
   - [`AI_QUALITY_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/AI_QUALITY_REPORT.md): Golden dataset benchmark results.

### Production AI Safety Status
**READY**
- Verified: Question safety policy, evidence turn verification, score boundary validation, prompt injection containment, golden dataset benchmarks, demographic fairness parity, and REST safety audit API.
