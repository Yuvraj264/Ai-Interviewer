import { describe, it, expect, beforeEach } from 'vitest';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { RealtimeService } from './realtime.service';

describe('InterviewsController Phase 8 Evaluation Endpoints', () => {
  let controller: InterviewsController;
  let service: InterviewsService;
  let realtimeService: RealtimeService;

  beforeEach(() => {
    service = new InterviewsService();
    realtimeService = new RealtimeService(service);
    controller = new InterviewsController(service, realtimeService);
  });

  it('should create session, trigger evaluation, and fetch evaluation result', () => {
    const createRes = controller.createSession({
      candidateName: 'Sam Developer',
      role: 'Backend Engineer',
    });
    const id = createRes.data!.id;

    const evalRes = controller.evaluateSession(id);
    expect(evalRes.success).toBe(true);
    expect(evalRes.data?.evaluationId).toBeDefined();
    expect(evalRes.data?.evaluatedDimensions.length).toBeGreaterThan(0);

    const getEvalRes = controller.getEvaluation(id);
    expect(getEvalRes.success).toBe(true);
    expect(getEvalRes.data?.interviewId).toBe(id);
  });

  it('should support submitting human reviewer overrides', () => {
    const createRes = controller.createSession({
      candidateName: 'Alex Mercer',
      role: 'Staff Engineer',
    });
    const id = createRes.data!.id;

    controller.evaluateSession(id);

    const reviewRes = controller.submitHumanReview(id, {
      reviewerId: 'rev_101',
      reviewerName: 'Lead Hiring Manager',
      humanOverrides: {
        'technical-knowledge': { score: 5, note: 'Exceeded expectations on system reliability design.' },
      },
      overallDecisionNote: 'Strong technical evidence observed.',
    });

    expect(reviewRes.success).toBe(true);
    expect(reviewRes.data?.review.reviewerName).toBe('Lead Hiring Manager');

    const updatedTechDim = reviewRes.data?.evaluation.evaluatedDimensions.find((d) => d.dimensionId === 'technical-knowledge');
    expect(updatedTechDim?.score).toBe(5);
  });
});
