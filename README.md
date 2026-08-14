# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 7 — Resume + Job Description Intelligence

The repository is currently at **Phase 7 (Resume + Job Description Intelligence)**. The system features structured candidate intelligence (`@ai-interviewer/interview-engine/intelligence`) that parses candidate resumes (`ResumeParser`), job descriptions (`JobDescriptionParser`), normalizes technical skills (`SkillNormalizer`), maps candidate-job alignment (`CandidateJobMatcher`), and generates prioritized interview targets (`VERIFY_RESUME_CLAIM`, `DEEP_DIVE_PROJECT`, `TEST_REQUIRED_SKILL`). **Raw resume and JD text are NEVER put directly into the realtime model context on every turn**—precomputed context slices (`InterviewContextBuilder`) are selected per question turn.

---

## System Architecture (Phase 7)

```text
Resume Document (PDF/DOCX/Text) ──► ResumeParser (RESUME_PARSER_V1) ──┐
                                                                       ├──► CandidateJobMatcher
Job Description (PDF/DOCX/Text) ──► JD Parser (JD_PARSER_V1) ──────────┘          │
                                                                                  ▼
                                                                        Interview Targets & Context
                                                                                  │
                                                                                  ▼
                                                                      InterviewContextBuilder
                                                                                  │
                                                                                  ▼
                                                                        Realtime Voice Agent
```

---

## API Endpoints

- `GET  /health`: Health monitoring & system phase check
- `POST /interviews`: Create candidate interview session (supports `resumeText` and `jobDescriptionText`)
- `GET  /interviews/:id`: Retrieve session status (supports session recovery on refresh)
- `POST /interviews/:id/start`: Transition session status to `IN_PROGRESS`
- `POST /interviews/:id/end`: Transition session status to `COMPLETED`
- `POST /interviews/:id/realtime/token`: Issue short-lived LiveKit participant JWT token for room `interview:{sessionId}`
- `POST /interviews/:id/resume`: Upload & parse candidate resume
- `POST /interviews/:id/jd`: Upload/paste & parse job description
- `GET  /interviews/:id/profile`: Retrieve parsed candidate profile, job profile, and match summary
- `POST /interviews/:id/prepare`: Prepare interview targets and precomputed context snapshot

---

## Development & Execution Commands

### Start All Development Applications
```bash
pnpm dev
```

### Run Linter
```bash
pnpm lint
```

### Run TypeScript Type Check
```bash
pnpm typecheck
```

### Run Unit Tests
```bash
pnpm test
```

### Build Production Bundle
```bash
pnpm build
```

---

## What Has NOT Been Implemented Yet (Intentionally Excluded in Phase 7)

- Candidate scoring & recruiter evaluation report (Phase 8)
- Recruiter analytics dashboard
- Cheating detection
