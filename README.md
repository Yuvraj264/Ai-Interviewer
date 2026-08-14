# AI Interviewer Platform

Production-oriented AI Voice Interviewer platform designed to conduct interactive, realtime candidate interviews.

---

## Current Status: Phase 12 — AI Safety, Fairness, Red-Team & AI Evaluation Quality

The repository is currently at **Phase 12 (AI Safety, Fairness, Red-Team & AI Evaluation Quality)**. The system features a centralized **SafetyPolicyEngine**, automated **RedTeamSuite** (100% attack containment), **GoldenDatasetSuite** (100% evidence traceability), **FairnessSuite** (0.00 demographic score variance), REST safety audit API (`GET /safety/audit`, `POST /safety/red-team`), and comprehensive security documentation.

---

## AI Safety & Security Highlights

- **Zero Trust for LLM Outputs**: `LLM Output` -> `Structured Schema Validation` -> `Safety Policy` -> `Domain Rules` -> `Evidence Rules` -> `Persist`.
- **Question Safety Policy**: Screens generated questions to reject protected characteristics (race, ethnicity, religion, political affiliation, sexual orientation, health, family planning) or off-topic prompts.
- **Red-Team Attack Containment**: Automated testing of 7 attack vectors (resume injection, JD injection, candidate answer injection, system prompt extraction, role-play attack, authority attack, encoded instructions) with 100% containment.
- **Demographic Fairness Parity**: Verified `0.00` score variance across demographic metadata (Name, University Prestige, Location) on equivalent transcript evidence.
- **Evidence Traceability & NO EVIDENCE = NO SCORE**: 100% of evaluation scores map directly back to transcript turn IDs. Un-tested competencies receive `INSUFFICIENT_EVIDENCE`.

---

## Security Documentation & Reports

- [`AI_THREAT_MODEL.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/AI_THREAT_MODEL.md): Comprehensive threat model covering 8 primary AI threat vectors.
- [`FAIRNESS_POLICY.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/FAIRNESS_POLICY.md): Formal demographic fairness policy.
- [`FAIRNESS_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/FAIRNESS_REPORT.md): Empirical fairness test results (`0.00` score variance).
- [`RED_TEAM_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/RED_TEAM_REPORT.md): Red-team attack suite outcomes (100% contained).
- [`AI_SAFETY_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/AI_SAFETY_REPORT.md): AI safety metrics report.
- [`AI_QUALITY_REPORT.md`](file:///Users/yuvraj/Desktop/projects/Ai%20Interviewer/AI_QUALITY_REPORT.md): Golden dataset benchmark results.

---

## Development & Production Commands

### Start All Development Applications
```bash
pnpm dev
```

### Run AI Safety & Red-Team Audit
```bash
curl -X POST http://localhost:3001/safety/red-team
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
