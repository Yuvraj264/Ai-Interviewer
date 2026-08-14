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
declare const PROJECT_PHASE: "Phase 5 \u2014 Interview State Machine & Interview Engine";

export { type AiConversationState, type ApiResponse, type CreateSessionDto, type EngineEventType, type EngineQuestion, type EngineQuestionState, type InterviewConfig, type InterviewEngineState, type InterviewSession, type InterviewStage, type InterviewType, type MicrophoneState, PROJECT_PHASE, type RealtimeConnectionState, type RealtimeTokenResponse, type SessionStatus, type SystemHealth, type TranscriptItem, createSessionSchema };
