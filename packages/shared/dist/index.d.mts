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
    organizationId?: string;
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
type VerificationStatus = 'UNVERIFIED' | 'PARTIALLY_VERIFIED' | 'SUPPORTED' | 'CONTRADICTORY';
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
    organizationId?: string;
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
    organizationId?: string;
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
type EvidenceType = 'DIRECT' | 'INDIRECT' | 'WEAK' | 'CONTRADICTORY';
type RequirementCoverageStatus = 'NOT_TESTED' | 'PARTIALLY_TESTED' | 'SUPPORTED' | 'STRONGLY_SUPPORTED' | 'CONTRADICTORY';
type EvaluationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NEEDS_REVIEW';
interface EvaluationEvidence {
    id: string;
    questionId: string;
    answerId: string;
    dimensionId: string;
    evidenceType: EvidenceType;
    summary: string;
    transcriptReference?: string;
    confidence: number;
}
interface EvaluationDimension {
    dimensionId: string;
    name: string;
    description: string;
    weight: number;
    required: boolean;
    score?: number;
    status: 'EVALUATED' | 'INSUFFICIENT_EVIDENCE';
    confidence: number;
    evidence: EvaluationEvidence[];
    limitations: string[];
}
interface RequirementEvaluation {
    skillOrRequirement: string;
    status: RequirementCoverageStatus;
    evidenceSummary: string;
    supportingQuestions: string[];
    confidence: number;
}
interface InterviewEvaluation {
    evaluationId: string;
    interviewId: string;
    status: EvaluationStatus;
    evaluatedDimensions: EvaluationDimension[];
    requirementEvaluations: RequirementEvaluation[];
    evaluationCoverage: {
        totalDimensions: number;
        evaluatedDimensionsCount: number;
        isComplete: boolean;
    };
    rubricVersion: string;
    promptVersion: string;
    modelVersion: string;
    timestamp: string;
}
interface HumanReviewOverride {
    score: number;
    note: string;
}
interface HumanReview {
    reviewId: string;
    evaluationId: string;
    reviewerId: string;
    reviewerName: string;
    humanOverrides: Record<string, HumanReviewOverride>;
    overallDecisionNote?: string;
    timestamp: string;
}
interface DashboardOverviewMetrics {
    totalInterviews: number;
    activeInterviews: number;
    completedInterviews: number;
    pendingEvaluations: number;
    interviewsNeedingReview: number;
    completionRatePercentage: number;
    averageDurationMinutes: number;
    averageRequirementCoveragePercentage: number;
}
interface AnalyticsData {
    operational: {
        startedCount: number;
        completedCount: number;
        completionRate: number;
        avgDurationMinutes: number;
        avgQuestionCount: number;
    };
    aiBehavior: {
        adaptiveFollowUpRate: number;
        fallbackRate: number;
        avgAdaptiveLatencyMs: number;
        topicDistribution: Record<string, number>;
    };
    evaluation: {
        evaluationCompletionRate: number;
        insufficientEvidenceRate: number;
        humanReviewRate: number;
        avgProcessingTimeMs: number;
    };
    requirementCoverage: {
        mostUntestedRequirements: string[];
        coverageByJob: Record<string, number>;
    };
}
interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
interface RecruiterTenantContext {
    recruiterId: string;
    recruiterName: string;
    organizationId: string;
    role: 'ADMIN' | 'RECRUITER' | 'REVIEWER';
}
interface DeepHealthStatus {
    status: 'ok' | 'degraded' | 'down';
    timestamp: string;
    uptime: number;
    environment: string;
    service: string;
    services: {
        database: boolean;
        redis: boolean;
        livekit: boolean;
    };
}
interface LoadTestResult {
    concurrency: number;
    durationSeconds: number;
    totalRequests: number;
    rps: number;
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
    errorRatePercentage: number;
    bottleneck: string;
}
declare const DEMO_SYNTHETIC_CANDIDATE: CandidateProfile;
declare const DEMO_SYNTHETIC_JOB: JobProfile;
interface DemoResetResponse {
    success: boolean;
    sessionId: string;
    message: string;
    timestamp: string;
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
declare const PROJECT_PHASE: "Phase 11 \u2014 Founder Demo, Product Excellence & AI Interview Quality";

export { type AdaptiveAction, type AdaptiveDecision, type AdaptiveDecisionRecord, type AiConversationState, type AnalyticsData, type AnswerAnalysis, type ApiResponse, type CandidateExperience, type CandidateJobProfile, type CandidateProfile, type CandidateProject, type CandidateSkill, type CreateSessionDto, DEMO_SYNTHETIC_CANDIDATE, DEMO_SYNTHETIC_JOB, type DashboardOverviewMetrics, type DeepHealthStatus, type DemoResetResponse, type DocumentProcessingStatus, type EngineEventType, type EngineQuestion, type EngineQuestionState, type EvaluationDimension, type EvaluationEvidence, type EvaluationStatus, type EvidenceItem, type EvidenceType, type HumanReview, type HumanReviewOverride, type InterviewConfig, type InterviewEngineState, type InterviewEvaluation, type InterviewSession, type InterviewStage, type InterviewTarget, type InterviewType, type JobProfile, type LoadTestResult, type MicrophoneState, PROJECT_PHASE, type PaginatedResponse, type QualityCategory, type RealtimeConnectionState, type RealtimeTokenResponse, type RecruiterTenantContext, type RequirementCoverageStatus, type RequirementEvaluation, type SessionStatus, type SkillRequirement, type SystemHealth, type TargetStatus, type TargetType, type TranscriptItem, type VerificationStatus, createSessionSchema };
