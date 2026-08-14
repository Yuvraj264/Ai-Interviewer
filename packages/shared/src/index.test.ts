import { describe, it, expect } from 'vitest';
import {
  PROJECT_PHASE,
  DeepHealthStatus,
  LoadTestResult,
} from './index';

describe('Shared Package Phase 10 Production Hardening Contracts', () => {
  it('should define the correct Phase 10 project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 10 — Production Hardening, Load Testing & Deployment');
  });

  it('should support DeepHealthStatus and LoadTestResult contracts', () => {
    const health: DeepHealthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: 1200,
      environment: 'production',
      service: 'api-service',
      services: {
        database: true,
        redis: true,
        livekit: true,
      },
    };
    expect(health.status).toBe('ok');
    expect(health.services.database).toBe(true);

    const loadResult: LoadTestResult = {
      concurrency: 50,
      durationSeconds: 10,
      totalRequests: 500,
      rps: 50,
      p50Ms: 12,
      p95Ms: 45,
      p99Ms: 85,
      errorRatePercentage: 0.0,
      bottleneck: 'None (Baseline OK)',
    };
    expect(loadResult.rps).toBe(50);
    expect(loadResult.p95Ms).toBe(45);
  });
});
