import { describe, it, expect } from 'vitest';
import {
  PROJECT_PHASE,
  DEMO_SYNTHETIC_CANDIDATE,
  DEMO_SYNTHETIC_JOB,
} from './index';

describe('Shared Package Phase 11 Demo Contracts & Fixtures', () => {
  it('should define the correct Phase 11 project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 11 — Founder Demo, Product Excellence & AI Interview Quality');
  });

  it('should export valid DEMO_SYNTHETIC_CANDIDATE and DEMO_SYNTHETIC_JOB fixtures', () => {
    expect(DEMO_SYNTHETIC_CANDIDATE.name).toBe('Alex Mercer');
    expect(DEMO_SYNTHETIC_CANDIDATE.skills.length).toBeGreaterThan(0);

    expect(DEMO_SYNTHETIC_JOB.title).toBe('Senior Backend Engineer');
    expect(DEMO_SYNTHETIC_JOB.requiredSkills.length).toBeGreaterThan(0);
  });
});
