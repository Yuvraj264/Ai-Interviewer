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

### Phase 6 — Adaptive Questioning
**Status**: NOT STARTED

---

## Phase 5 Implementation Log

### Phase 5 Entry Point
```text
Phase 4 voice interview verified
       ↓
Voice conversation works
       ↓
Introduce deterministic Interview Engine & State Machine
```

### Phase 5 Architecture

```text
Candidate Speech
       ↓
Realtime Agent
       ↓
Candidate Answer Event
       ↓
Interview Engine (Deterministic State Machine)
       │
       ├── Validates Stage & Time Limit
       ├── Enforces Question Budget
       ├── Updates Covered Topics
       └── Selects Allowed Next Question
       ↓
Realtime Agent
       ↓
OpenAI Realtime (Conversational Phrasing)
       ↓
Candidate Speaker
```

### State Machine Lifecycle
- `CREATED` -> `WAITING` -> `INTRO` -> `BACKGROUND` -> `PROJECT_DEEP_DIVE` -> `TECHNICAL` -> `BEHAVIORAL` -> `CLOSING` -> `COMPLETING` -> `COMPLETED`
- Terminal States: `COMPLETED`, `CANCELLED`, `FAILED`

### Engine Completion Precedence Policy
1. Explicit Candidate End (`endSession()`)
2. System / Provider Failure (`FAILED`)
3. Time Limit Reached (`remainingSeconds <= 0`)
4. Question Budget Exhausted (`questionsAsked >= maxQuestions`)
5. Normal Stage Completion (`CLOSING` -> `COMPLETED`)

### Core Architectural Principle
- **THE LLM DOES NOT OWN INTERVIEW STATE.** The Interview Engine deterministically validates and applies all state transitions, question budgets, and completion rules. The LLM provides natural conversational phrasing for engine-selected questions but cannot alter session status or skip stages.

### Environment Independence
- `@ai-interviewer/interview-engine` has zero dependencies on React, browser APIs, LiveKit, or OpenAI SDKs. It runs purely in Node.js or unit tests.

### Files Added/Modified in Phase 5
- `packages/shared/src/index.ts`
- `packages/shared/src/index.test.ts`
- `packages/interview-engine/src/bank/questions.ts`
- `packages/interview-engine/src/engine/domain-errors.ts`
- `packages/interview-engine/src/engine/interview-engine.ts`
- `packages/interview-engine/src/engine/interview-engine.test.ts`
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
