import { describe, it, expect, beforeEach } from 'vitest';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { InterviewsService } from '../interviews/interviews.service';

describe('DashboardController Phase 9 Endpoints', () => {
  let controller: DashboardController;
  let interviewsService: InterviewsService;
  let dashboardService: DashboardService;

  beforeEach(() => {
    interviewsService = new InterviewsService();
    dashboardService = new DashboardService(interviewsService);
    controller = new DashboardController(dashboardService);
  });

  it('should return overview metrics and handle empty dataset cleanly', () => {
    const res = controller.getOverview();
    expect(res.success).toBe(true);
    expect(res.data?.totalInterviews).toBe(0);
    expect(res.data?.completionRatePercentage).toBe(0);
  });

  it('should return paginated interviews list with filtering and search', () => {
    interviewsService.createSession({ candidateName: 'Alex Mercer', role: 'Staff Engineer' });
    interviewsService.createSession({ candidateName: 'Sam Tech', role: 'Backend Engineer' });

    const res = controller.getInterviews(undefined, 'Alex');
    expect(res.success).toBe(true);
    expect(res.data?.total).toBe(1);
    expect(res.data?.items[0].candidateName).toBe('Alex Mercer');
  });

  it('should return operational and AI analytics data', () => {
    const res = controller.getAnalytics();
    expect(res.success).toBe(true);
    expect(res.data?.operational.startedCount).toBeDefined();
    expect(res.data?.aiBehavior.fallbackRate).toBeDefined();
  });
});
