import { describe, it, expect, beforeEach } from 'vitest';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  it('should return health status with status ok and service api', () => {
    const response = healthController.getHealth();
    expect(response.status).toBe('ok');
    expect(response.service).toBe('api');
    expect(response.phase).toBe('Phase 1 — Foundation');
    expect(typeof response.timestamp).toBe('string');
  });
});
