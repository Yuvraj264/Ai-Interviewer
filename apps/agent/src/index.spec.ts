import { describe, it, expect, beforeEach } from 'vitest';
import { AgentWorker } from './index';

describe('AgentWorker & InterviewEngine Integration', () => {
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

  it('should support joining room and executing InterviewEngine controlled question turns', async () => {
    await worker.start();
    const room = await worker.joinRoom('sess_engine_agent_123', {
      candidateName: 'Sam Tech',
      role: 'Staff Engineer',
      interviewType: 'technical',
    });

    expect(room.roomName).toBe('interview:sess_engine_agent_123');

    const session = worker.getSession('sess_engine_agent_123');
    expect(session).toBeDefined();

    const engineState = session!.getEngineState();
    expect(engineState.stage).toBe('INTRO');
    expect(engineState.questionsAsked).toBe(1);

    // Simulate candidate turn
    session!.handleCandidateTurnCompleted('I have 5 years experience in full stack development.');
    
    const engineState2 = session!.getEngineState();
    expect(engineState2.questionsAsked).toBeGreaterThanOrEqual(2);

    await worker.leaveRoom('sess_engine_agent_123');
    expect(worker.getStatus().activeSessions).toBe(0);

    await worker.stop();
  });
});
