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

---

## Phase 8 Implementation Record

### What Was Built
1. **Evidence-Based Interview Evaluation Subsystem (`packages/interview-engine/src/evaluation`)**:
   - `EvaluationRubric`: Configurable evaluation rubrics per engineering role (`BACKEND_ENGINEER_RUBRIC_V1`).
   - `EvidenceEvaluator`: Versioned evaluation engine (`EVALUATION_ENGINE_V1` & `EVALUATION_PROMPT_VERSION`) scoring observable transcript evidence against rubric dimensions.
   - **NO EVIDENCE = NO SCORE**: Un-tested competencies receive `score: undefined` and `status: 'INSUFFICIENT_EVIDENCE'`.
   - **Evidence Traceability**: Every non-null 1–5 score maps directly back to transcript question/answer IDs.
   - **Requirement Coverage Mapping**: Maps job requirements to `SUPPORTED`, `STRONGLY_SUPPORTED`, `PARTIALLY_TESTED`, `NOT_TESTED`, or `CONTRADICTORY`.
   - `HumanReviewService`: Supports human reviewer overrides and notes without mutating historical AI evidence. Preserves audit trail (`reviewerId`, `timestamp`, `previousValue`, `newValue`, `note`).

---

## Phase 9 Implementation Record

### What Was Built
1. **Recruiter Intelligence Workspace (`apps/web/src/app/recruiter/page.tsx`)**:
   - **DashboardOverview**: High-value metrics cards (Total Interviews, Active, Completed, Pending Evals, Completion Rate %, Avg Duration, Requirement Coverage %).
   - **CandidateListView**: Candidate directory with search, filter, pagination, and Claim Verification UI (`SUPPORTED`, `PARTIALLY VERIFIED`, `UNVERIFIED`).
   - **InterviewDetailWorkspace**: Tabbed workspace (Overview, Transcript with search, Questions & Adaptive Flow visualizer, Evidence Explorer with click-to-transcript drill-down, Phase 8 Evaluation report, Human Review sign-off).
   - **AnalyticsView**: Server-side operational, AI behavior, evaluation, and requirement coverage analytics.
2. **Backend Dashboard Subsystem (`apps/api/src/dashboard`)**:
   - `AnalyticsService` (`packages/interview-engine/src/analytics/analytics-service.ts`): Server-side metric calculation with zero-denominator safety (`NaN%`/`Infinity%` handling).
   - `DashboardService` & `DashboardController`: REST endpoints (`GET /dashboard/overview`, `GET /dashboard/candidates`, `GET /dashboard/interviews`, `GET /dashboard/jobs`, `GET /dashboard/analytics`) enforcing multi-tenant isolation (`organizationId`).

---

## Phase 10 Implementation Record

### What Was Built
1. **Environment Configuration & Fail-Fast Startup Validation**:
   - Extended `packages/config` with production fail-fast check. In `production` environment, missing credentials (`DATABASE_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `OPENAI_API_KEY`) halt boot immediately rather than crashing during live candidate sessions.
2. **Production Observability & Security Hardening (`apps/api`)**:
   - `StructuredLoggerService`: Emits JSON structured logs (`level`, `event`, `correlationId`, `sessionId`, `tenantId`, `durationMs`). Automatically redacts PII, resume text, transcripts, bearer tokens, and API keys.
   - `CorrelationIdMiddleware`: Propagates `X-Correlation-ID` header across HTTP context.
   - `RateLimiterGuard`: Enforces request quotas (120 req/min) per client IP.
   - `HealthController`: Exposes `GET /health` (liveness) and `GET /health/readiness` (deep readiness probe checking DB, Redis, LiveKit).
   - `main.ts`: Configures Helmet security headers, CORS origin restriction, NestJS shutdown hooks (`SIGTERM`/`SIGINT`).
3. **Realtime WebRTC Resilience (`apps/agent`)**:
   - Added `handleReconnection()` to `RealtimeVoiceSession` for auto-reconnection and session state recovery on WebRTC network dropouts.
4. **Load Testing & Benchmarking Suite (`infra/load-tests`)**:
   - `LoadTester`: Repeatable load test benchmark tool measuring RPS, `p50Ms`, `p95Ms`, `p99Ms` latencies, error rates, and identifying bottlenecks.
5. **Containerization & Operational Runbook**:
   - Multi-stage production `Dockerfile` running as non-root `node` user.
   - `.dockerignore` excluding `.git`, `node_modules`, and local caches.
   - `RUNBOOK.md` detailing operational procedures, readiness checks, incident response, rollbacks, and database backups.

### Architectural Decisions & Non-Inclusions
- **Modular Monolith Architecture**: Avoided microservices theater. Splitting the app into 6 microservices introduces operational overhead without performance gain for current concurrency targets.
- **No Kubernetes by Default**: Standard containerized deployment with managed load balancing provides optimal simplicity and reliability.
- **No Kafka by Default**: Workloads are efficiently handled by PostgreSQL, Redis, and worker queues.

### Testing & Verification
- Unit test suite (`health.controller.spec.ts`, `benchmark.test.ts`, `index.test.ts`) verifying readiness probes, load testing percentiles, structured logger, and correlation IDs.
- Full workspace verification: `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

### Production Readiness Summary
**READY WITH KNOWN LIMITATIONS**
- Verified: Reliability, Scalability, Security, Observability, Fail-fast config, Graceful shutdown, Load testing, Containerization.
- Known Limitations: Multi-region auto-failover and OCR document parsing not included (intended for future infrastructure expansions).
