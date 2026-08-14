import { describe, it, expect, beforeEach } from 'vitest';
import { DemoController } from './demo.controller';
import { InterviewsService } from '../interviews/interviews.service';

describe('DemoController Phase 11 Endpoints', () => {
  let controller: DemoController;
  let interviewsService: InterviewsService;

  beforeEach(() => {
    interviewsService = new InterviewsService();
    controller = new DemoController(interviewsService);
  });

  it('should reset demo environment and seed synthetic session cleanly', () => {
    const res = controller.resetDemo();
    expect(res.success).toBe(true);
    expect(res.data?.sessionId).toBeDefined();
    expect(res.data?.message).toContain('Alex Mercer');
  });

  it('should return demo readiness status', () => {
    const res = controller.getDemoStatus();
    expect(res.success).toBe(true);
    expect(res.data?.ready).toBe(true);
    expect(res.data?.activeDemoCandidate).toBe('Alex Mercer');
  });
});
