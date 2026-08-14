import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, createSessionSchema } from '@ai-interviewer/shared';

describe('Web App Phase 11 Founder Demo Shell', () => {
  it('should reference correct Phase 11 project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 11 — Founder Demo, Product Excellence & AI Interview Quality');
  });

  it('should validate form schema inputs before API submission', () => {
    const valid = createSessionSchema.safeParse({
      candidateName: 'Alex Mercer',
      role: 'Senior Backend Engineer',
      type: 'technical',
      durationMinutes: 20,
    });
    expect(valid.success).toBe(true);
  });
});
