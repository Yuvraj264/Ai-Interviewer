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
1. **Adaptive Questioning Engine (`packages/interview-engine/src/adaptive`)**: Introduced an evidence-grounded adaptive questioning engine (`AnswerAnalyzer`, `AdaptiveDecisionMaker`, `AdaptiveQuestionSelector`, `DeterministicFallbackHandler`, `AdaptiveQuestioningEngine`).
2. **Prompt Injection Defense & Hallucination Control**: `ANSWER_ANALYSIS_V1` treats transcript as untrusted data. Grounded concept check ensures evidence claims only reference concepts explicitly present in candidate transcript.

---

## Phase 7 Implementation Record

### What Was Built
1. **Resume & Job Description Intelligence (`packages/interview-engine/src/intelligence`)**:
   - `SkillNormalizer`: Deterministic skill taxonomy & alias mapping (`Node JS` -> `Node.js`, `Postgres` -> `PostgreSQL`).
   - `ResumeParser` (`RESUME_PARSER_V1`): Parses candidate experience, projects, education, and normalized skills with `verificationStatus: 'UNVERIFIED'`.
   - `JobDescriptionParser` (`JD_PARSER_V1`): Parses job descriptions, separating Required vs Preferred skills, responsibilities, qualifications, and domains.
   - `CandidateJobMatcher`: Maps Candidate Profile to Job Profile to generate prioritized `InterviewTarget` lists (`VERIFY_RESUME_CLAIM`, `TEST_REQUIRED_SKILL`, `DEEP_DIVE_PROJECT`, `EXPLORE_GAP`).
   - `InterviewContextBuilder`: Precomputes bounded context slices per turn based on active target and candidate evidence without overflowing LLM context budget.
2. **REST API Service Integration (`apps/api`)**:
   - Exposed `POST /interviews/:id/resume`, `POST /interviews/:id/jd`, `GET /interviews/:id/profile`, and `POST /interviews/:id/prepare`.
3. **Document Security & Context Architecture**:
   - Raw resume/JD documents are **NEVER put directly into the realtime model context on every turn**.
   - Parsers treat document content as untrusted data (`RESUME_PARSER_V1` & `JD_PARSER_V1`).

### Testing & Verification
- Unit test suite (`intelligence.test.ts`) covering skill normalization, resume parsing, JD parsing, candidate-job matching, target generation, context budget bounds, and multi-candidate/multi-job isolation.
- Full workspace verification: `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

### Known Limitations
Phase 7 establishes candidate/job intelligence and context building. It explicitly does **NOT** contain:
- Final candidate scoring or hiring recommendations
- Recruiter evaluation report generator
- Behavioral personality scoring
- Cheating detection

### Next Phase
**Phase 8 — Interview Evaluation & Evidence-Based Scoring**
