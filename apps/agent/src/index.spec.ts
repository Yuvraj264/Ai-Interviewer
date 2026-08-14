import { describe, it, expect, beforeEach } from 'vitest';
import { AgentWorker } from './index';

describe('AgentWorker & Phase 7 Resume/JD Intelligence Integration', () => {
  let worker: AgentWorker;

  beforeEach(() => {
    worker = new AgentWorker();
  });

  it('should initialize worker with status stopped and zero active rooms', () => {
    const status = worker.getStatus();
    expect(status.health.status).toBe('down');
    expect(status.activeSessions).toBe(0);
    expect(status.openaiConfigured).toBe(true);
  });

  it('should support joining room and executing Adaptive Engine with Resume + JD context', async () => {
    await worker.start();
    const room = await worker.joinRoom('sess_intel_agent_123', {
      candidateName: 'Sam Tech',
      role: 'Staff Engineer',
      interviewType: 'technical',
      resumeText: 'Built PrimeBank using Spring Boot, PostgreSQL, and Redis.',
      jobDescriptionText: 'Required: PostgreSQL and Node.js.',
    });

    expect(room.roomName).toBe('interview:sess_intel_agent_123');

    const session = worker.getSession('sess_intel_agent_123');
    expect(session).toBeDefined();

    const turnContext = session!.getTurnContext();
    expect(turnContext.candidateSummary).toContain('Sam Tech');
    expect(turnContext.jobRole).toContain('Staff Engineer');
    expect(turnContext.activeTarget).toBeDefined();

    // Simulate candidate turn
    await session!.handleCandidateTurnCompleted('I built PrimeBank microservices with Redis caching.');
    
    const adaptiveRecords = session!.getAdaptiveRecords();
    expect(adaptiveRecords.length).toBe(1);

    await worker.leaveRoom('sess_intel_agent_123');
    expect(worker.getStatus().activeSessions).toBe(0);

    await worker.stop();
  });
});
