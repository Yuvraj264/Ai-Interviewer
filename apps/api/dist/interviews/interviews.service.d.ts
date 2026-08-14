import { InterviewSession, CandidateProfile, JobProfile, CandidateJobProfile, InterviewEvaluation, HumanReview, HumanReviewOverride } from '@ai-interviewer/shared';
import { BoundedInterviewContext } from '@ai-interviewer/interview-engine';
export declare class InterviewsService {
    private sessions;
    private candidateProfiles;
    private jobProfiles;
    private matches;
    private precomputedContexts;
    private evaluations;
    private transcripts;
    private resumeParser;
    private jdParser;
    private matcher;
    private contextBuilder;
    private evaluator;
    private humanReviewService;
    createSession(payload: {
        candidateName: string;
        role: string;
        type?: 'technical' | 'behavioral' | 'mixed';
        durationMinutes?: number;
        resumeText?: string;
        jobDescriptionText?: string;
    }): InterviewSession;
    getSession(id: string): InterviewSession;
    startSession(id: string): InterviewSession;
    endSession(id: string): InterviewSession;
    parseResume(sessionId: string, resumeText: string): CandidateProfile;
    parseJobDescription(sessionId: string, jdText: string): JobProfile;
    getProfile(sessionId: string): {
        candidateProfile?: CandidateProfile;
        jobProfile?: JobProfile;
        match?: CandidateJobProfile;
    };
    prepareInterview(sessionId: string): {
        match: CandidateJobProfile;
        turnContext: BoundedInterviewContext;
    };
    evaluateSession(sessionId: string): InterviewEvaluation;
    getEvaluation(sessionId: string): InterviewEvaluation;
    submitHumanReview(sessionId: string, payload: {
        reviewerId: string;
        reviewerName: string;
        humanOverrides: Record<string, HumanReviewOverride>;
        overallDecisionNote?: string;
    }): {
        evaluation: InterviewEvaluation;
        review: HumanReview;
    };
    getAllSessions(): InterviewSession[];
    getAllEvaluations(): Map<string, InterviewEvaluation>;
    getAllCandidateProfiles(): CandidateProfile[];
    getAllJobProfiles(): JobProfile[];
    getMatchesForCandidate(candidateId: string): CandidateJobProfile[];
    getAllAdaptiveRecords(): never[];
    private recalculateMatch;
}
//# sourceMappingURL=interviews.service.d.ts.map