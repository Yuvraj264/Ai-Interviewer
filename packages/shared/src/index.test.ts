import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, SystemHealth } from './index';

describe('Shared Package Foundation', () => {
  it('should export current project phase constant', () => {
    expect(PROJECT_PHASE).toBe('Phase 1 — Foundation');
  });

  it('should validate SystemHealth type structure', () => {
    const health: SystemHealth = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: 120,
      environment: 'test',
      service: 'test-service',
    };
    expect(health.status).toBe('ok');
    expect(health.service).toBe('test-service');
  });
});
