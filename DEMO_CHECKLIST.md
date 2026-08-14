# AI Interviewer Platform — Live Demo Pre-Flight Checklist

## Pre-Flight Verification Checklist

Run this checklist 15 minutes before any live founder demo.

```text
[ ] Environment Validation:
    - API Server running on port 3001
    - Web Frontend running on port 3000
    - Redis / Valkey connected on port 6379
    - LiveKit WebRTC server connected on port 7880

[ ] Demo Data Reset:
    - Execute POST http://localhost:3001/demo/reset
    - Verify response: "Demo environment reset cleanly. Synthetic candidate Alex Mercer prepared."

[ ] Candidate Shell (/interview/sess_recruiter_demo):
    - Verify microphone permissions
    - Confirm WebRTC audio connection indicator is GREEN

[ ] Recruiter Workspace (/recruiter):
    - Confirm "⚡ Founder Demo Mode" badge is visible
    - Confirm Candidate "Alex Mercer" is listed with SUPPORTED claim badges

[ ] Post-Interview Evaluation:
    - Verify Evidence Explorer clickable drill-down works
    - Confirm Human Review override controls submit cleanly
```
