import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE } from '@ai-interviewer/shared';

describe('Web App Homepage Shell', () => {
  it('should reference correct project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 1 — Foundation');
  });
});
