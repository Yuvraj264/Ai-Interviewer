import { ApiResponse, CandidateProfile, JobProfile, CandidateJobProfile, InterviewSession, InterviewEvaluation, DashboardOverviewMetrics, AnalyticsData, PaginatedResponse } from '@ai-interviewer/shared';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverview(orgId?: string): ApiResponse<DashboardOverviewMetrics>;
    getCandidates(query?: string, page?: string, limit?: string, orgId?: string): ApiResponse<PaginatedResponse<CandidateProfile>>;
    getCandidateById(id: string): ApiResponse<{
        candidate: CandidateProfile;
        matches: CandidateJobProfile[];
    }>;
    getInterviews(status?: string, query?: string, page?: string, limit?: string, orgId?: string): ApiResponse<PaginatedResponse<InterviewSession>>;
    getInterviewById(id: string): ApiResponse<{
        session: InterviewSession;
        profile?: CandidateProfile;
        job?: JobProfile;
        evaluation?: InterviewEvaluation;
    }>;
    getJobs(orgId?: string): ApiResponse<JobProfile[]>;
    getAnalytics(orgId?: string): ApiResponse<AnalyticsData>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map