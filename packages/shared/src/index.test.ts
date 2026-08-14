import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE } from './index';

describe('Shared Package Phase 12 Safety Contracts', () => {
  it('should define the correct Phase 12 project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 12 — AI Safety, Fairness, Red-Team & AI Evaluation Quality');
  });
});
