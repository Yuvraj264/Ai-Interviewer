import { describe, it, expect, beforeEach } from 'vitest';
import { AgentWorker } from './index';

describe('AgentWorker Realtime Transport Shell', () => {
  let worker: AgentWorker;

  beforeEach(() => {
    worker = new AgentWorker();
  });

  it('should initialize with status stopped and zero active rooms', () => {
    const status = worker.getStatus();
    expect(status.health.status).toBe('down');
    expect(status.activeSessions).toBe(0);
  });

  it('should support joining and leaving an interview room', async () => {
    await worker.start();
    const room = await worker.joinRoom('sess_test_123');

    expect(room.roomName).toBe('interview:sess_test_123');
    expect(room.agentIdentity).toBe('agent-sess_test_123');

    let status = worker.getStatus();
    expect(status.activeSessions).toBe(1);
    expect(status.livekitConnected).toBe(true);

    await worker.leaveRoom('sess_test_123');
    status = worker.getStatus();
    expect(status.activeSessions).toBe(0);

    await worker.stop();
  });
});
