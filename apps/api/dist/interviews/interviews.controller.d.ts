import { ApiResponse, InterviewSession, CandidateProfile, JobProfile, CandidateJobProfile, InterviewEvaluation, HumanReview, HumanReviewOverride, RealtimeTokenResponse } from '@ai-interviewer/shared';
import { BoundedInterviewContext } from '@ai-interviewer/interview-engine';
import { InterviewsService } from './interviews.service';
import { RealtimeService } from './realtime.service';
export declare class InterviewsController {
    private readonly interviewsService;
    private readonly realtimeService;
    constructor(interviewsService: InterviewsService, realtimeService: RealtimeService);
    createSession(body: {
        candidateName: string;
        role: string;
        type?: 'technical' | 'behavioral' | 'mixed';
        durationMinutes?: number;
        resumeText?: string;
        jobDescriptionText?: string;
    }): ApiResponse<InterviewSession>;
    getSession(id: string): ApiResponse<InterviewSession>;
    startSession(id: string): ApiResponse<InterviewSession>;
    endSession(id: string): ApiResponse<InterviewSession>;
    getRealtimeToken(id: string): Promise<ApiResponse<RealtimeTokenResponse>>;
    parseResume(id: string, body: {
        resumeText: string;
    }): ApiResponse<CandidateProfile>;
    parseJobDescription(id: string, body: {
        jobDescriptionText: string;
    }): ApiResponse<JobProfile>;
    getProfile(id: string): ApiResponse<{
        candidateProfile?: CandidateProfile;
        jobProfile?: JobProfile;
        match?: CandidateJobProfile;
    }>;
    prepareInterview(id: string): ApiResponse<{
        match: CandidateJobProfile;
        turnContext: BoundedInterviewContext;
    }>;
    evaluateSession(id: string): ApiResponse<InterviewEvaluation>;
    getEvaluation(id: string): ApiResponse<InterviewEvaluation>;
    submitHumanReview(id: string, body: {
        reviewerId: string;
        reviewerName: string;
        humanOverrides: Record<string, HumanReviewOverride>;
        overallDecisionNote?: string;
    }): ApiResponse<{
        evaluation: InterviewEvaluation;
        review: HumanReview;
    }>;
}
//# sourceMappingURL=interviews.controller.d.ts.map