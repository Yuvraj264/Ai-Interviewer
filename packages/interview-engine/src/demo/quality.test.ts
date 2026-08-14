import { describe, it, expect, beforeEach } from 'vitest';
import { DemoQualitySuite } from './quality-suite';
import { DEMO_SYNTHETIC_CANDIDATE, DEMO_SYNTHETIC_JOB, InterviewEvaluation } from '@ai-interviewer/shared';

describe('Phase 11 AI Quality Suite & Product Excellence Subsystem', () => {
  let qualitySuite: DemoQualitySuite;

  beforeEach(() => {
    qualitySuite = new DemoQualitySuite();
  });

  it('should detect hallucinated experience claims in generated questions', () => {
    const validQ = 'You mentioned building PrimeBank microservices with PostgreSQL. How did you design database indexing?';
    const validRes = qualitySuite.verifyPersonalization(DEMO_SYNTHETIC_CANDIDATE, DEMO_SYNTHETIC_JOB, validQ);
    expect(validRes.passed).toBe(true);

    const hallucinatedQ = 'You mentioned you used GraphQL extensively at PrimeBank. How did you structure schema resolvers?';
    const invalidRes = qualitySuite.verifyPersonalization(DEMO_SYNTHETIC_CANDIDATE, DEMO_SYNTHETIC_JOB, hallucinatedQ);
    expect(invalidRes.passed).toBe(false);
    expect(invalidRes.reason.toLowerCase()).toContain('graphql');
  });

  it('should prevent topic repetition when a topic has been asked twice', () => {
    const topics = ['Intro', 'PostgreSQL', 'PostgreSQL'];
    const res = qualitySuite.verifyRepetitionPrevention(topics, 'PostgreSQL');
    expect(res.passed).toBe(false);
  });

  it('should identify contradictory statements across turns cleanly', () => {
    const status = qualitySuite.verifyContradictionDetection(
      'I used Redis extensively for write-through caching.',
      'I have never used Redis in production.'
    );
    expect(status).toBe('CONTRADICTORY');
  });

  it('should classify candidate questions and repeat requests accurately', () => {
    expect(qualitySuite.classifyCandidateIntent('Could you repeat the question?')).toBe('REPEAT_REQUEST');
    expect(qualitySuite.classifyCandidateIntent('What architecture does your backend team use?')).toBe('CANDIDATE_QUESTION');
    expect(qualitySuite.classifyCandidateIntent('I used Spring Boot with PostgreSQL indexing.')).toBe('ANSWER');
  });

  it('should verify demographic neutrality across identical evaluations', () => {
    const evalA: InterviewEvaluation = {
      evaluationId: 'eval_a',
      interviewId: 'sess_1',
      status: 'COMPLETED',
      evaluatedDimensions: [{ dimensionId: 'tech', name: 'Technical', description: 'Technical Knowledge', weight: 1, required: true, score: 4, status: 'EVALUATED', confidence: 0.9, evidence: [], limitations: [] }],
      requirementEvaluations: [],
      evaluationCoverage: { totalDimensions: 1, evaluatedDimensionsCount: 1, isComplete: true },
      rubricVersion: 'v1',
      promptVersion: 'v1',
      modelVersion: 'v1',
      timestamp: new Date().toISOString(),
    };

    const evalB = JSON.parse(JSON.stringify(evalA));
    const fairness = qualitySuite.verifyDemographicFairness(evalA, evalB);
    expect(fairness.passed).toBe(true);
  });
});
