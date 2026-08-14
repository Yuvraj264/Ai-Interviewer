import { describe, it, expect } from 'vitest';
import {
  PROJECT_PHASE,
  DashboardOverviewMetrics,
  AnalyticsData,
} from './index';

describe('Shared Package Phase 9 Dashboard & Analytics Contracts', () => {
  it('should define the correct current project phase', () => {
    expect(PROJECT_PHASE).toBe('Phase 9 — Recruiter Dashboard & Interview Analytics');
  });

  it('should support DashboardOverviewMetrics and AnalyticsData structures', () => {
    const metrics: DashboardOverviewMetrics = {
      totalInterviews: 10,
      activeInterviews: 2,
      completedInterviews: 8,
      pendingEvaluations: 1,
      interviewsNeedingReview: 2,
      completionRatePercentage: 80.0,
      averageDurationMinutes: 18.5,
      averageRequirementCoveragePercentage: 85.0,
    };

    expect(metrics.totalInterviews).toBe(10);
    expect(metrics.completionRatePercentage).toBe(80.0);

    const analytics: AnalyticsData = {
      operational: {
        startedCount: 10,
        completedCount: 8,
        completionRate: 80.0,
        avgDurationMinutes: 18.5,
        avgQuestionCount: 5.2,
      },
      aiBehavior: {
        adaptiveFollowUpRate: 35.0,
        fallbackRate: 2.5,
        avgAdaptiveLatencyMs: 45,
        topicDistribution: { Technical: 60, SystemDesign: 40 },
      },
      evaluation: {
        evaluationCompletionRate: 100.0,
        insufficientEvidenceRate: 10.0,
        humanReviewRate: 25.0,
        avgProcessingTimeMs: 120,
      },
      requirementCoverage: {
        mostUntestedRequirements: ['Kubernetes'],
        coverageByJob: { 'Backend Engineer': 85.0 },
      },
    };

    expect(analytics.operational.completionRate).toBe(80.0);
    expect(analytics.aiBehavior.fallbackRate).toBe(2.5);
  });
});
