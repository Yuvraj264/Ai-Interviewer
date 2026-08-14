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
type InterviewStage = 'INTRO' | 'BACKGROUND' | 'TECHNICAL' | 'BEHAVIORAL' | 'COMPLETION';
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
declare const PROJECT_PHASE: "Phase 4 \u2014 First End-to-End Voice Interview";

export { type AiConversationState, type ApiResponse, type CreateSessionDto, type InterviewSession, type InterviewStage, type InterviewType, type MicrophoneState, PROJECT_PHASE, type RealtimeConnectionState, type RealtimeTokenResponse, type SessionStatus, type SystemHealth, type TranscriptItem, createSessionSchema };
