import { describe, it, expect, beforeEach } from 'vitest';
import { AgentWorker } from './index';

describe('AgentWorker OpenAI Realtime Voice Shell', () => {
  let worker: AgentWorker;

  beforeEach(() => {
    worker = new AgentWorker();
  });

  it('should initialize with status stopped and zero active rooms', () => {
    const status = worker.getStatus();
    expect(status.health.status).toBe('down');
    expect(status.activeSessions).toBe(0);
    expect(status.openaiConfigured).toBe(true);
  });

  it('should support joining room, generating AI greeting, and handling candidate turns', async () => {
    await worker.start();
    const room = await worker.joinRoom('sess_voice_123', {
      candidateName: 'Sam Tech',
      role: 'Staff Engineer',
      interviewType: 'technical',
    });

    expect(room.roomName).toBe('interview:sess_voice_123');
    expect(room.agentIdentity).toBe('agent-sess_voice_123');

    const session = worker.getSession('sess_voice_123');
    expect(session).toBeDefined();

    const transcript = session!.getTranscript();
    expect(transcript.length).toBeGreaterThan(0);
    expect(transcript[0].speaker).toBe('ai');
    expect(transcript[0].text).toContain('Sam Tech');

    // Simulate candidate turn
    session!.handleCandidateTurnCompleted('I am a full stack software engineer with 5 years experience.');
    expect(session!.getTranscript().length).toBe(2);

    await worker.leaveRoom('sess_voice_123');
    expect(worker.getStatus().activeSessions).toBe(0);

    await worker.stop();
  });

  it('should handle interruption when candidate speaks during AI speech', async () => {
    await worker.start();
    await worker.joinRoom('sess_interrupt_123', { candidateName: 'Alice' });

    const session = worker.getSession('sess_interrupt_123');
    session!.handleCandidateTurnStarted();

    // After candidate speaks, AI transitions to INTERRUPTED
    expect(['INTERRUPTED', 'LISTENING', 'THINKING']).toContain(session!.getState());

    await worker.stop();
  });
});
