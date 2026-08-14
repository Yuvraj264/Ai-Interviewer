import { describe, it, expect } from 'vitest';
import {
  PROJECT_PHASE,
  InterviewStage,
  EngineQuestion,
  AnswerAnalysis,
  AdaptiveDecision,
} from './index';

describe('Shared Package Phase 6 Adaptive Contracts', () => {
  it('should export current Phase 6 project phase constant', () => {
    expect(PROJECT_PHASE).toBe('Phase 6 — Adaptive Questioning Engine');
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

  it('should validate AnswerAnalysis and AdaptiveDecision contracts', () => {
    const analysis: AnswerAnalysis = {
      answerId: 'ans_123',
      questionId: 'q_tech_rest_01',
      transcript: 'I used Redis for caching.',
      completeness: 'HIGH',
      relevance: 'HIGH',
      depth: 'MEDIUM',
      qualityCategory: 'STRONG',
      conceptsDetected: ['redis', 'caching'],
      skillsDemonstrated: ['caching'],
      missingConcepts: ['cache-invalidation'],
      evidence: [{ claim: 'Candidate used Redis for caching', confidence: 'HIGH' }],
    };

    const decision: AdaptiveDecision = {
      action: 'FOLLOW_UP',
      targetTopic: 'cache-invalidation',
      difficulty: 'medium',
      rationale: 'Candidate described caching but did not explain invalidation.',
      confidence: 0.9,
      basedOnQuestionId: 'q_tech_rest_01',
    };

    expect(analysis.qualityCategory).toBe('STRONG');
    expect(decision.action).toBe('FOLLOW_UP');
  });
});
