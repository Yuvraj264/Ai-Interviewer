import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, createSessionSchema, InterviewSession } from './index';

describe('Shared Package Phase 2 Contracts', () => {
  it('should export current project phase constant', () => {
    expect(PROJECT_PHASE).toBe('Phase 2 — Candidate Interview Shell');
  });

  it('should validate valid CreateSessionDto payload', () => {
    const payload = {
      candidateName: 'Jane Doe',
      role: 'Full Stack Engineer',
      type: 'technical',
      durationMinutes: 20,
    };
    const result = createSessionSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('should reject invalid CreateSessionDto payload', () => {
    const payload = {
      candidateName: 'J',
      role: '',
      type: 'invalid-type',
      durationMinutes: 45,
    };
    const result = createSessionSchema.safeParse(payload);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.candidateName).toBeDefined();
      expect(errors.role).toBeDefined();
      expect(errors.type).toBeDefined();
      expect(errors.durationMinutes).toBeDefined();
    }
  });

  it('should format complete InterviewSession contract', () => {
    const session: InterviewSession = {
      id: 'sess_12345',
      candidateName: 'Jane Doe',
      role: 'Backend Engineer',
      type: 'mixed',
      durationMinutes: 30,
      status: 'IN_PROGRESS',
      currentStage: 'TECHNICAL',
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    };
    expect(session.status).toBe('IN_PROGRESS');
    expect(session.currentStage).toBe('TECHNICAL');
  });
});
