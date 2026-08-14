import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, createSessionSchema } from '@ai-interviewer/shared';

describe('Web App Phase 2 Integration Shell', () => {
  it('should reference correct Phase 2 project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 2 — Candidate Interview Shell');
  });

  it('should validate form schema inputs before API submission', () => {
    const valid = createSessionSchema.safeParse({
      candidateName: 'Sam Tech',
      role: 'Full Stack Engineer',
      type: 'technical',
      durationMinutes: 20,
    });
    expect(valid.success).toBe(true);

    const invalid = createSessionSchema.safeParse({
      candidateName: '',
      role: '',
      type: 'unknown',
      durationMinutes: 45,
    });
    expect(invalid.success).toBe(false);
  });
});
