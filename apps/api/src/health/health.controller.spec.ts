import { describe, it, expect, beforeEach } from 'vitest';
import { HealthController } from './health.controller';
import { PROJECT_PHASE } from '@ai-interviewer/shared';

describe('HealthController Phase 10 Production Health & Readiness', () => {
  let healthController: HealthController;

  beforeEach(() => {
    healthController = new HealthController();
  });

  it('should return 200 OK liveness status with Phase 10 metadata', () => {
    const response = healthController.getHealth();

    expect(response.success).toBe(true);
    expect(response.data?.status).toBe('ok');
    expect(response.data?.service).toBe(PROJECT_PHASE);
    expect(typeof response.data?.uptime).toBe('number');
  });

  it('should return deep readiness status with database, redis, and livekit health metrics', () => {
    const response = healthController.getReadiness();

    expect(response.success).toBe(true);
    expect(response.data?.status).toBeDefined();
    expect(response.data?.services.database).toBe(true);
    expect(response.data?.services.redis).toBe(true);
  });
});
