import { InterviewSession, CandidateProfile, JobProfile, CandidateJobProfile, InterviewEvaluation, DashboardOverviewMetrics, AnalyticsData, PaginatedResponse } from '@ai-interviewer/shared';
import { InterviewsService } from '../interviews/interviews.service';
export declare class DashboardService {
    private readonly interviewsService;
    private analyticsService;
    constructor(interviewsService: InterviewsService);
    getOverview(organizationId?: string): DashboardOverviewMetrics;
    getCandidates(query?: string, page?: number, limit?: number, organizationId?: string): PaginatedResponse<CandidateProfile>;
    getCandidateById(candidateId: string): {
        candidate: CandidateProfile;
        matches: CandidateJobProfile[];
    };
    getInterviews(status?: string, query?: string, page?: number, limit?: number, organizationId?: string): PaginatedResponse<InterviewSession>;
    getInterviewById(sessionId: string): {
        session: InterviewSession;
        profile?: CandidateProfile;
        job?: JobProfile;
        evaluation?: InterviewEvaluation;
    };
    getJobs(organizationId?: string): JobProfile[];
    getAnalytics(organizationId?: string): AnalyticsData;
}
//# sourceMappingURL=dashboard.service.d.ts.map