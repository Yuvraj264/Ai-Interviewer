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
declare const PROJECT_PHASE: "Phase 3 \u2014 Realtime Audio Foundation";

export { type ApiResponse, type CreateSessionDto, type InterviewSession, type InterviewStage, type InterviewType, type MicrophoneState, PROJECT_PHASE, type RealtimeConnectionState, type RealtimeTokenResponse, type SessionStatus, type SystemHealth, createSessionSchema };
