import { z } from 'zod';

declare const createSessionSchema: z.ZodObject<{
    candidateName: z.ZodString;
    role: z.ZodString;
    type: z.ZodEnum<["technical", "behavioral", "mixed"]>;
    durationMinutes: z.ZodEffects<z.ZodNumber, number, number>;
}, "strip", z.ZodTypeAny, {
    candidateName: string;
    role: string;
    type: "technical" | "behavioral" | "mixed";
    durationMinutes: number;
}, {
    candidateName: string;
    role: string;
    type: "technical" | "behavioral" | "mixed";
    durationMinutes: number;
}>;
type CreateSessionDto = z.infer<typeof createSessionSchema>;

type SessionStatus = 'CREATED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
type InterviewStage = 'CREATED' | 'WAITING' | 'INTRO' | 'BACKGROUND' | 'PROJECT_DEEP_DIVE' | 'TECHNICAL' | 'BEHAVIORAL' | 'CLOSING' | 'COMPLETING' | 'COMPLETION' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
type InterviewType = 'technical' | 'behavioral' | 'mixed';
interface InterviewSession {
    id: string;
    candidateName: string;
    role: string;
    type: InterviewType;
    durationMinutes: number;
    status: SessionStatus;
    currentStage: InterviewStage;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    resumeText?: string;
    jobDescriptionText?: string;
}
type RealtimeConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'FAILED';
type MicrophoneState = 'IDLE' | 'REQUESTING' | 'ACTIVE' | 'DENIED' | 'ERROR';
type AiConversationState = 'IDLE' | 'CONNECTING' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'INTERRUPTED' | 'RECONNECTING' | 'ERROR' | 'ENDING';
type EngineQuestionState = 'CREATED' | 'ASKING' | 'WAITING_FOR_ANSWER' | 'ANSWERING' | 'ANSWER_RECEIVED' | 'COMPLETED' | 'CANCELLED';
type EngineEventType = 'INTERVIEW_STARTED' | 'QUESTION_STARTED' | 'CANDIDATE_ANSWER_RECEIVED' | 'QUESTION_COMPLETED' | 'STAGE_COMPLETED' | 'TIME_LIMIT_REACHED' | 'QUESTION_LIMIT_REACHED' | 'INTERVIEW_ENDED' | 'INTERVIEW_CANCELLED';
interface EngineQuestion {
    id: string;
    stage: InterviewStage;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    prompt: string;
    objective: string;
}
interface InterviewConfig {
    type: InterviewType;
    durationMinutes: number;
    maxQuestions: number;
    stages: InterviewStage[];
    topics: string[];
    difficulty: string;
}
interface InterviewEngineState {
    sessionId: string;
    status: SessionStatus;
    stage: InterviewStage;
    currentQuestionIndex: number;
    currentQuestion?: EngineQuestion;
    currentQuestionState?: EngineQuestionState;
    coveredTopics: string[];
    remainingTopics: string[];
    askedQuestionIds: string[];
    startedAt?: string;
    elapsedSeconds: number;
    remainingSeconds: number;
    questionsAsked: number;
    questionsRemaining: number;
    isCompleted: boolean;
}
type QualityCategory = 'STRONG' | 'ADEQUATE' | 'WEAK' | 'INCOMPLETE' | 'UNCLEAR';
type AdaptiveAction = 'FOLLOW_UP' | 'PROBE' | 'CLARIFY' | 'INCREASE_DIFFICULTY' | 'DECREASE_DIFFICULTY' | 'NEW_TOPIC' | 'REVISIT_TOPIC' | 'TRANSITION_STAGE';
interface EvidenceItem {
    claim: string;
    confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}
interface AnswerAnalysis {
    answerId: string;
    questionId: string;
    transcript: string;
    completeness: 'LOW' | 'MEDIUM' | 'HIGH';
    relevance: 'LOW' | 'MEDIUM' | 'HIGH';
    depth: 'LOW' | 'MEDIUM' | 'HIGH';
    qualityCategory: QualityCategory;
    conceptsDetected: string[];
    skillsDemonstrated: string[];
    missingConcepts: string[];
    evidence: EvidenceItem[];
}
interface AdaptiveDecision {
    action: AdaptiveAction;
    targetTopic?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    rationale: string;
    confidence: number;
    basedOnQuestionId: string;
}
interface AdaptiveDecisionRecord {
    sessionId: string;
    previousQuestionId: string;
    analysis: AnswerAnalysis;
    decision: AdaptiveDecision;
    selectedQuestionId: string;
    validationResult: 'ACCEPTED' | 'FALLBACK_USED';
    timestamp: string;
}
type VerificationStatus = 'UNVERIFIED' | 'PARTIALLY_VERIFIED' | 'SUPPORTED' | 'CONTRADICTED';
type TargetType = 'VERIFY_RESUME_CLAIM' | 'TEST_REQUIRED_SKILL' | 'DEEP_DIVE_PROJECT' | 'EXPLORE_GAP' | 'VERIFY_EXPERIENCE' | 'BEHAVIORAL';
type TargetStatus = 'PENDING' | 'IN_PROGRESS' | 'SUFFICIENTLY_VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'SKIPPED';
type DocumentProcessingStatus = 'NOT_PROCESSED' | 'PROCESSING' | 'READY' | 'FAILED';
interface CandidateSkill {
    canonicalName: string;
    rawName: string;
    category: string;
    source: 'resume';
    evidence: string;
    verificationStatus: VerificationStatus;
}
interface CandidateProject {
    name: string;
    description: string;
    technologies: string[];
    role?: string;
    outcomes?: string[];
}
interface CandidateExperience {
    company: string;
    role: string;
    startDate?: string;
    endDate?: string;
    responsibilities: string[];
    technologies: string[];
}
interface CandidateProfile {
    candidateId: string;
    name?: string;
    headline?: string;
    summary?: string;
    education: Array<{
        institution: string;
        degree: string;
        field?: string;
    }>;
    experience: CandidateExperience[];
    projects: CandidateProject[];
    skills: CandidateSkill[];
    sourceDocumentId?: string;
}
interface SkillRequirement {
    skill: string;
    importance: 'CORE' | 'IMPORTANT' | 'OPTIONAL';
    isRequired: boolean;
    evidence?: string;
}
interface JobProfile {
    jobId: string;
    title: string;
    company?: string;
    seniority?: string;
    summary?: string;
    requiredSkills: SkillRequirement[];
    preferredSkills: SkillRequirement[];
    responsibilities: string[];
    qualifications: string[];
    domains: string[];
}
interface InterviewTarget {
    id: string;
    type: TargetType;
    topic: string;
    reason: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    verificationGoal: string;
    status: TargetStatus;
}
interface CandidateJobProfile {
    candidateId: string;
    jobId: string;
    matchedSkills: string[];
    missingSkills: string[];
    unverifiedSkills: string[];
    relevantProjects: CandidateProject[];
    interviewTargets: InterviewTarget[];
}
interface TranscriptItem {
    id: string;
    speaker: 'ai' | 'candidate';
    text: string;
    timestamp: string;
}
interface RealtimeTokenResponse {
    token: string;
    url: string;
    roomName: string;
    participantIdentity: string;
}
interface SystemHealth {
    status: 'ok' | 'degraded' | 'down';
    timestamp: string;
    uptime: number;
    environment: string;
    service: string;
}
interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: string;
}
declare const PROJECT_PHASE: "Phase 7 \u2014 Resume + Job Description Intelligence";

export { type AdaptiveAction, type AdaptiveDecision, type AdaptiveDecisionRecord, type AiConversationState, type AnswerAnalysis, type ApiResponse, type CandidateExperience, type CandidateJobProfile, type CandidateProfile, type CandidateProject, type CandidateSkill, type CreateSessionDto, type DocumentProcessingStatus, type EngineEventType, type EngineQuestion, type EngineQuestionState, type EvidenceItem, type InterviewConfig, type InterviewEngineState, type InterviewSession, type InterviewStage, type InterviewTarget, type InterviewType, type JobProfile, type MicrophoneState, PROJECT_PHASE, type QualityCategory, type RealtimeConnectionState, type RealtimeTokenResponse, type SessionStatus, type SkillRequirement, type SystemHealth, type TargetStatus, type TargetType, type TranscriptItem, type VerificationStatus, createSessionSchema };
