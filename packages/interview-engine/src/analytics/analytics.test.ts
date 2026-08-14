import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsService } from './analytics-service';
import { InterviewSession, InterviewEvaluation, AdaptiveDecisionRecord } from '@ai-interviewer/shared';

describe('Phase 9 AnalyticsService Subsystem', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
  });

  it('should handle zero-denominator datasets cleanly without NaN% or Infinity%', () => {
    const sessions: InterviewSession[] = [];
    const evaluations = new Map<string, InterviewEvaluation>();
    const records: AdaptiveDecisionRecord[] = [];

    const overview = analyticsService.calculateOverviewMetrics(sessions, evaluations);
    expect(overview.totalInterviews).toBe(0);
    expect(overview.completionRatePercentage).toBe(0);
    expect(overview.averageDurationMinutes).toBe(0);
    expect(overview.averageRequirementCoveragePercentage).toBe(0);

    const analytics = analyticsService.calculateAnalyticsData(sessions, evaluations, records);
    expect(analytics.operational.completionRate).toBe(0);
    expect(analytics.aiBehavior.fallbackRate).toBe(0);
    expect(analytics.aiBehavior.adaptiveFollowUpRate).toBe(0);
  });

  it('should calculate accurate metrics for non-empty sessions dataset', () => {
    const sessions: InterviewSession[] = [
      {
        id: 's1',
        candidateName: 'Candidate One',
        role: 'Backend Engineer',
        type: 'technical',
        durationMinutes: 20,
        status: 'COMPLETED',
        currentStage: 'COMPLETED',
        createdAt: '2026-08-15T00:00:00Z',
      },
      {
        id: 's2',
        candidateName: 'Candidate Two',
        role: 'Backend Engineer',
        type: 'technical',
        durationMinutes: 20,
        status: 'IN_PROGRESS',
        currentStage: 'TECHNICAL',
        createdAt: '2026-08-15T00:00:00Z',
      },
    ];

    const evaluations = new Map<string, InterviewEvaluation>();

    const overview = analyticsService.calculateOverviewMetrics(sessions, evaluations);
    expect(overview.totalInterviews).toBe(2);
    expect(overview.activeInterviews).toBe(1);
    expect(overview.completedInterviews).toBe(1);
    expect(overview.completionRatePercentage).toBe(50.0);
  });

  it('should filter metrics by tenant organizationId correctly', () => {
    const sessions: InterviewSession[] = [
      {
        id: 's1',
        candidateName: 'Company A Candidate',
        role: 'Engineer',
        type: 'technical',
        durationMinutes: 20,
        status: 'COMPLETED',
        currentStage: 'COMPLETED',
        createdAt: '2026-08-15T00:00:00Z',
        organizationId: 'org_a',
      },
      {
        id: 's2',
        candidateName: 'Company B Candidate',
        role: 'Engineer',
        type: 'technical',
        durationMinutes: 20,
        status: 'IN_PROGRESS',
        currentStage: 'TECHNICAL',
        createdAt: '2026-08-15T00:00:00Z',
        organizationId: 'org_b',
      },
    ];

    const evaluations = new Map<string, InterviewEvaluation>();

    const metricsOrgA = analyticsService.calculateOverviewMetrics(sessions, evaluations, 'org_a');
    expect(metricsOrgA.totalInterviews).toBe(1);
    expect(metricsOrgA.completedInterviews).toBe(1);

    const metricsOrgB = analyticsService.calculateOverviewMetrics(sessions, evaluations, 'org_b');
    expect(metricsOrgB.totalInterviews).toBe(1);
    expect(metricsOrgB.activeInterviews).toBe(1);
  });
});
