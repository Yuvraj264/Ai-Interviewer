import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, createSessionSchema } from '@ai-interviewer/shared';

describe('Web App Phase 9 Recruiter Workspace Shell', () => {
  it('should reference correct Phase 9 project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 9 — Recruiter Dashboard & Interview Analytics');
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
