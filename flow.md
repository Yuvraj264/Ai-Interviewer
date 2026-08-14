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

### Phase 4 — First End-to-End Voice Interview
**Status**: COMPLETED

### Phase 5 — Interview State Machine & Interview Engine
**Status**: COMPLETED

### Phase 6 — Adaptive Questioning Engine
**Status**: COMPLETED

### Phase 7 — Resume + Job Description Intelligence
**Status**: NOT STARTED

---

## Phase 6 Implementation Log

### Phase 6 Entry Point
```text
Phase 5 Interview Engine verified
       ↓
Structured interview state machine exists
       ↓
Introduce evidence-grounded adaptive questioning engine
```

### Phase 6 Architecture & Workflow

```text
Candidate Speech
       ↓
Realtime Agent
       ↓
Candidate Answer
       ↓
Answer Analysis (Completeness, Depth, Relevance, Quality Category)
       ↓
Evidence Extraction (Grounded Concept Claims, Missing Concepts)
       ↓
Adaptive Decision (Action: FOLLOW_UP, PROBE, CLARIFY, INCREASE_DIFFICULTY, NEW_TOPIC)
       ↓
Interview Engine Validation & Difficulty Bounds Check
       ↓
Question Filtering & Ranking (Topic Cooldowns & Follow-up Limits)
       ↓
Selected Question
       ↓
Realtime Agent Voice Output
```

### Supported Adaptive Actions
- `FOLLOW_UP`: Candidate gave incomplete answer omitting key concept (e.g. mentioned Redis but omitted cache invalidation).
- `PROBE`: Candidate gave adequate high-level response; probing for technical depth.
- `CLARIFY`: Candidate answer transcript was ambiguous or unclear.
- `INCREASE_DIFFICULTY`: Candidate demonstrated 2 consecutive `STRONG` answers (`EASY` -> `MEDIUM` -> `HARD`).
- `DECREASE_DIFFICULTY`: Candidate struggled on 2 consecutive `WEAK` answers (`HARD` -> `MEDIUM` -> `EASY`).
- `NEW_TOPIC`: Current topic sufficiently covered with strong evidence; transitioning to next topic.

### Mandatory Fallback Strategy
- Handled Failure Modes: `TIMEOUT`, `RATE_LIMIT`, `INVALID_OUTPUT`, `PROVIDER_ERROR`, `SCHEMA_VALIDATION_ERROR`.
- Preserves current interview state. Selects next valid question from question bank deterministically without failing candidate session.

### Latency Measurement Breakdown
- `analysisLatencyMs`: Answer transcript analysis & evidence extraction.
- `decisionLatencyMs`: Adaptive decision generation & rationale mapping.
- `totalAdaptiveLatencyMs`: Total pipeline latency from candidate turn end to question selection.

### Files Added/Modified in Phase 6
- `packages/shared/src/index.ts`
- `packages/shared/src/index.test.ts`
- `packages/interview-engine/src/adaptive/analyzer.ts`
- `packages/interview-engine/src/adaptive/decision-maker.ts`
- `packages/interview-engine/src/adaptive/question-selector.ts`
- `packages/interview-engine/src/adaptive/fallback-handler.ts`
- `packages/interview-engine/src/adaptive/adaptive-engine.ts`
- `packages/interview-engine/src/adaptive/adaptive-engine.test.ts`
- `packages/interview-engine/src/index.ts`
- `apps/agent/src/realtime-session.ts`
- `apps/agent/src/index.spec.ts`
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
