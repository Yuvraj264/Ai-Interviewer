import { describe, it, expect, beforeEach } from 'vitest';
import { AgentWorker } from './index';

describe('AgentWorker Foundation Shell', () => {
  let worker: AgentWorker;

  beforeEach(() => {
    worker = new AgentWorker();
  });

  it('should initialize with status stopped and livekit disconnected', () => {
    const status = worker.getStatus();
    expect(status.health.status).toBe('down');
    expect(status.livekitConnected).toBe(false);
    expect(status.activeSessions).toBe(0);
  });

  it('should update status to ok after starting', async () => {
    await worker.start();
    const status = worker.getStatus();
    expect(status.health.status).toBe('ok');
    expect(status.livekitConnected).toBe(false);
    await worker.stop();
    expect(worker.getStatus().health.status).toBe('down');
  });
});
