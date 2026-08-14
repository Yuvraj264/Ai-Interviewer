import { describe, it, expect } from 'vitest';
import {
  PROJECT_PHASE,
  InterviewStage,
  InterviewEvaluation,
  EvaluationDimension,
} from './index';

describe('Shared Package Phase 8 Evaluation Contracts', () => {
  it('should define the correct current project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 8 — Evidence-Based Interview Evaluation');
  });

  it('should support valid interview stages including COMPLETED', () => {
    const stage: InterviewStage = 'COMPLETED';
    expect(stage).toBe('COMPLETED');
  });

  it('should validate structured InterviewEvaluation schema', () => {
    const dimension: EvaluationDimension = {
      dimensionId: 'technical-knowledge',
      name: 'Technical Knowledge',
      description: 'Understanding of core concepts and design tradeoffs.',
      weight: 25,
      required: true,
      score: 4,
      status: 'EVALUATED',
      confidence: 0.9,
      evidence: [
        {
          id: 'ev_01',
          questionId: 'q_tech_rest_01',
          answerId: 'ans_01',
          dimensionId: 'technical-knowledge',
          evidenceType: 'DIRECT',
          summary: 'Candidate explained database indexing and tradeoffs.',
          transcriptReference: 'q_tech_rest_01',
          confidence: 0.9,
        },
      ],
      limitations: [],
    };

    const evalResult: InterviewEvaluation = {
      evaluationId: 'eval_123',
      interviewId: 'sess_123',
      status: 'COMPLETED',
      evaluatedDimensions: [dimension],
      requirementEvaluations: [
        {
          skillOrRequirement: 'PostgreSQL',
          status: 'SUPPORTED',
          evidenceSummary: 'Candidate explained database indexing.',
          supportingQuestions: ['q_tech_rest_01'],
          confidence: 0.9,
        },
      ],
      evaluationCoverage: {
        totalDimensions: 4,
        evaluatedDimensionsCount: 1,
        isComplete: false,
      },
      rubricVersion: 'BACKEND_ENGINEER_RUBRIC_V1',
      promptVersion: 'EVALUATION_PROMPT_V1',
      modelVersion: 'EVALUATION_ENGINE_V1',
      timestamp: new Date().toISOString(),
    };

    expect(evalResult.evaluationId).toBe('eval_123');
    expect(evalResult.evaluatedDimensions[0].score).toBe(4);
    expect(evalResult.requirementEvaluations[0].status).toBe('SUPPORTED');
  });
});
