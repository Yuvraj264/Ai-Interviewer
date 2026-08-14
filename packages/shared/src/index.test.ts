import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, InterviewStage, EngineQuestion } from './index';

describe('Shared Package Phase 5 Contracts', () => {
  it('should export current Phase 5 project phase constant', () => {
    expect(PROJECT_PHASE).toBe('Phase 5 — Interview State Machine & Interview Engine');
  });

  it('should support valid InterviewStage enum values', () => {
    const stages: InterviewStage[] = [
      'CREATED',
      'WAITING',
      'INTRO',
      'BACKGROUND',
      'PROJECT_DEEP_DIVE',
      'TECHNICAL',
      'BEHAVIORAL',
      'CLOSING',
      'COMPLETING',
      'COMPLETED',
      'CANCELLED',
      'FAILED',
    ];
    expect(stages.length).toBe(12);
  });

  it('should validate EngineQuestion contract', () => {
    const q: EngineQuestion = {
      id: 'tech_rest_01',
      stage: 'TECHNICAL',
      topic: 'rest-api',
      difficulty: 'medium',
      prompt: 'Explain what a REST API is.',
      objective: 'Evaluate REST architecture understanding.',
    };
    expect(q.id).toBe('tech_rest_01');
    expect(q.difficulty).toBe('medium');
  });
});
