# AI Interviewer Platform — 5-Minute Founder Demo Script

## Overview
This script outlines the exact 5-minute product demonstration for founders, investors, and hiring executives, showcasing the difference between a simple fixed-script voice bot and an adaptive AI Interviewer.

---

## Demo Agenda (5 Minutes)

```text
Act 1: Problem & Intelligence Preparation (0:00 - 1:00)
Act 2: Personalized Voice Greeting & Candidate Setup (1:00 - 2:00)
Act 3: Adaptive Follow-Up & Dynamic Probe (2:00 - 3:15)
Act 4: Evidence Extraction & Traceability (3:15 - 4:15)
Act 5: Job Requirement Coverage & Human Sign-Off (4:15 - 5:00)
```

---

## Act 1 — Problem & Intelligence Preparation (0:00 – 1:00)

**Presenter Talking Points**:
> *"Most AI voice bots act like rigid forms over audio—asking Question 1, Question 2, Question 3 regardless of what the candidate says. Our platform is an AI Interviewer. Before the interview starts, it parses the candidate's resume and job requirements to build structured interview targets."*

**Action**:
1. Open Recruiter Workspace (`/recruiter`).
2. Show synthetic candidate **Alex Mercer** (Senior Backend Engineer) and **Senior Backend Engineer** job description.
3. Highlight **Claim Verification UI**:
   - `PostgreSQL`: `SUPPORTED` (Extracted from resume experience)
   - `Redis`: `SUPPORTED` (Extracted from caching experience)
   - `Kubernetes`: `UNVERIFIED` (Claimed on resume, but not yet verified by interview evidence)

---

## Act 2 — Personalized Voice Greeting (1:00 – 2:00)

**Presenter Talking Points**:
> *"Notice how the interviewer introduces itself. It knows the candidate's background and immediately targets observable engineering experience rather than asking generic questions."*

**Action**:
1. Click **Start Interview** in the candidate shell (`/interview/sess_recruiter_demo`).
2. **AI Voice**:
   > *"Welcome Alex! I'm your AI interviewer today. I noticed in your experience at PrimeBank that you architected microservices handling payments. To kick things off, could you walk me through your technical approach to PostgreSQL indexing and database design in that project?"*

---

## Act 3 — Adaptive Follow-Up & Dynamic Probe (2:00 – 3:15)

**Presenter Talking Points**:
> *"This is the central wow moment. The candidate answers with specific technical claims. The AI listens, extracts concepts, and dynamically selects a follow-up question based on evidence gaps."*

**Candidate Answer**:
> *"I built PrimeBank payment microservices with Spring Boot and PostgreSQL composite B-tree indexing. We also added Redis write-through caching to lower read latency."*

**AI Voice (Adaptive Reaction)**:
> *"Got it. You mentioned write-through caching with Redis. What specific eviction rules or TTL strategy did you use to prevent stale cache data during high-volume payment bursts?"*

**Presenter Point**:
> *"The AI didn't follow a pre-written script. It detected the Redis claim, recognized an evidence gap regarding cache invalidation, and dynamically asked a focused follow-up."*

---

## Act 4 — Evidence Extraction & Traceability (3:15 – 4:15)

**Presenter Talking Points**:
> *"After the interview completes, the recruiter doesn't get a black-box score. They get complete evidence traceability. Let's inspect the evaluation report."*

**Action**:
1. Switch to **Interview Detail Workspace** -> **Evidence Explorer**.
2. Click on evidence card: `TECHNICAL KNOWLEDGE — DIRECT EVIDENCE: Candidate explained write-through cache eviction rules and TTL strategy.`
3. **Result**: The UI smoothly highlights exact transcript turn `t4` where the candidate gave the answer.

---

## Act 5 — Requirement Coverage & Human Sign-Off (4:15 – 5:00)

**Presenter Talking Points**:
> *"Finally, we map candidate evidence directly to job requirements. Notice that Kubernetes remains UNVERIFIED because it wasn't tested in this short session. The AI never makes an autonomous hiring decision—the human hiring manager remains authoritative."*

**Action**:
1. Show Job Requirement Coverage matrix (`PostgreSQL: SUPPORTED`, `Redis: SUPPORTED`, `Kubernetes: NOT TESTED`).
2. Demonstrate **Human Review Override**: Change score from 4 to 3 with note: *"Good theoretical knowledge, but production scale was limited."*
3. Show immutable audit trail capturing reviewer ID and timestamp.
