import { describe, it, expect, beforeEach } from 'vitest';
import { SafetyController } from './safety.controller';

describe('SafetyController Phase 12 Endpoints', () => {
  let controller: SafetyController;

  beforeEach(() => {
    controller = new SafetyController();
  });

  it('should return 100% clean safety audit report', () => {
    const res = controller.getSafetyAudit();
    expect(res.success).toBe(true);
    expect(res.data?.status).toBe('SAFE');
    expect(res.data?.questionSafetyPercentage).toBe(100.0);
    expect(res.data?.promptInjectionResistancePercentage).toBe(100.0);
  });

  it('should execute red-team attack suite and report 100% attack containment', () => {
    const res = controller.runRedTeam();
    expect(res.success).toBe(true);
    expect(res.data?.totalAttacks).toBe(7);
    expect(res.data?.containedCount).toBe(7);
  });
});
