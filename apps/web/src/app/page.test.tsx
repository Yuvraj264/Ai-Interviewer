import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, createSessionSchema } from '@ai-interviewer/shared';

describe('Web App Phase 8 Evidence Evaluation Shell', () => {
  it('should reference correct Phase 8 project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 8 — Evidence-Based Interview Evaluation');
  });

  it('should validate form schema inputs before API submission', () => {
    const valid = createSessionSchema.safeParse({
      candidateName: 'Sam Tech',
      role: 'Full Stack Engineer',
      type: 'technical',
      durationMinutes: 20,
    });
    expect(valid.success).toBe(true);
  });
});
