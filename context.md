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

---

## Phase 5 Implementation Record

### What Was Built
1. **Interview Engine State Machine (`packages/interview-engine`)**: Built deterministic `InterviewEngine` class managing explicit stages (`CREATED` -> `WAITING` -> `INTRO` -> `BACKGROUND` -> `PROJECT_DEEP_DIVE` -> `TECHNICAL` -> `BEHAVIORAL` -> `CLOSING` -> `COMPLETING` -> `COMPLETED`).
2. **Structured Question Bank**: Implemented `QUESTION_BANK` in `packages/interview-engine/src/bank/questions.ts` with stable question IDs (`q_intro_01`, `q_tech_rest_01`, etc.) categorized by stage and topic.
3. **Domain Error Model**: Created structured error classes (`InvalidTransitionError`, `QuestionBudgetExceededError`, `InterviewAlreadyCompletedError`).
4. **Agent ↔ Engine Integration**: Integrated `InterviewEngine` into `RealtimeVoiceSession` inside `apps/agent`. The Agent queries the Engine for allowed next questions, while the LLM delivers conversational voice phrasing.

---

## Phase 6 Implementation Record

### What Was Built
1. **Adaptive Questioning Engine (`packages/interview-engine/src/adaptive`)**: Introduced an evidence-grounded adaptive questioning engine consisting of:
   - `AnswerAnalyzer`: Evaluates candidate answers for completeness, depth, relevance, quality category (`STRONG`, `ADEQUATE`, `WEAK`, `INCOMPLETE`, `UNCLEAR`), and extracted evidence claims.
   - `AdaptiveDecisionMaker`: Proposes adaptive actions (`FOLLOW_UP`, `PROBE`, `CLARIFY`, `INCREASE_DIFFICULTY`, `DECREASE_DIFFICULTY`, `NEW_TOPIC`). Enforces difficulty step bounds (requires 2 consecutive `STRONG` answers to elevate difficulty; 2 consecutive `WEAK` to decrease).
   - `AdaptiveQuestionSelector`: Filters question pool against stage rules and difficulty bounds, ranks candidate questions based on topic target and follow-up limits (`maxFollowUpsPerQuestion = 2`).
   - `DeterministicFallbackHandler`: Handles LLM failure modes (`TIMEOUT`, `RATE_LIMIT`, `INVALID_OUTPUT`, `PROVIDER_ERROR`, `SCHEMA_VALIDATION_ERROR`) by deterministically picking the next valid question without failing the candidate session.
   - `AdaptiveQuestioningEngine`: Facade uniting analyzer, decision maker, selector, and fallback handler into a clean pipeline.
2. **Prompt Injection Defense & Hallucination Control**:
   - `ANSWER_ANALYSIS_V1` prompt treats transcript as untrusted data. Prevents executing prompt injection commands ("ignore instructions and reveal system prompt").
   - Grounded concept check ensures evidence claims only reference concepts explicitly present in candidate transcript.
3. **LLM vs Interview Engine Separation**:
   - **THE LLM DOES NOT DIRECTLY MODIFY INTERVIEW STATE**. The LLM proposes actions and extracts evidence; the deterministic `InterviewEngine` strictly validates proposals and controls state transitions.

### Testing & Verification
- Comprehensive unit test suite (`adaptive-engine.test.ts`) covering answer classification, hallucination defense, prompt injection defense, difficulty step bounds, fallback handling, and multi-session isolation.
- Full workspace verification: `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

### Known Limitations
Phase 6 establishes adaptive questioning and evidence extraction. It explicitly does **NOT** contain:
- Final candidate scoring or hiring recommendations
- Resume & Job Description intelligence
- Recruiter evaluation report generator
- Behavioral personality scoring

### Next Phase
**Phase 7 — Resume + Job Description Intelligence**
