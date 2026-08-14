import { describe, it, expect, beforeEach } from 'vitest';
import { AgentWorker } from './index';

describe('AgentWorker & Phase 6 Adaptive Engine Integration', () => {
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

  it('should support joining room and executing Adaptive Engine answer analysis loop', async () => {
    await worker.start();
    const room = await worker.joinRoom('sess_adapt_agent_123', {
      candidateName: 'Sam Tech',
      role: 'Staff Engineer',
      interviewType: 'technical',
    });

    expect(room.roomName).toBe('interview:sess_adapt_agent_123');

    const session = worker.getSession('sess_adapt_agent_123');
    expect(session).toBeDefined();

    const engineState = session!.getEngineState();
    expect(engineState.stage).toBe('INTRO');
    expect(engineState.questionsAsked).toBe(1);

    // Simulate candidate turn with technical answer
    await session!.handleCandidateTurnCompleted('I used Redis caching and PostgreSQL in Node.');
    
    const adaptiveRecords = session!.getAdaptiveRecords();
    expect(adaptiveRecords.length).toBe(1);
    expect(adaptiveRecords[0].analysis.qualityCategory).toBe('STRONG');
    expect(adaptiveRecords[0].decision.action).toBeDefined();

    const telemetry = session!.getTelemetry();
    expect(telemetry.totalAdaptiveLatencyMs).toBeGreaterThanOrEqual(0);

    await worker.leaveRoom('sess_adapt_agent_123');
    expect(worker.getStatus().activeSessions).toBe(0);

    await worker.stop();
  });
});
