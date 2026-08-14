import { describe, it, expect, beforeEach } from 'vitest';
import { HealthController } from './health.controller';
import { PROJECT_PHASE } from '@ai-interviewer/shared';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  it('should return health status with status ok and current project phase', () => {
    const response = healthController.getHealth();
    expect(response.status).toBe('ok');
    expect(response.service).toBe('api');
    expect(response.phase).toBe(PROJECT_PHASE);
    expect(typeof response.timestamp).toBe('string');
  });
});
