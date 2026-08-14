import { InterviewSession, CandidateProfile, JobProfile, CandidateJobProfile } from '@ai-interviewer/shared';
import { BoundedInterviewContext } from '@ai-interviewer/interview-engine';
export declare class InterviewsService {
    private sessions;
    private candidateProfiles;
    private jobProfiles;
    private matches;
    private precomputedContexts;
    private resumeParser;
    private jdParser;
    private matcher;
    private contextBuilder;
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
    private recalculateMatch;
}
//# sourceMappingURL=interviews.service.d.ts.map