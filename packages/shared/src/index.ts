export * from './session.schema';

export type SessionStatus = 'CREATED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InterviewStage = 'INTRO' | 'BACKGROUND' | 'TECHNICAL' | 'BEHAVIORAL' | 'COMPLETION';
export type InterviewType = 'technical' | 'behavioral' | 'mixed';

export interface InterviewSession {
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

export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export const PROJECT_PHASE = 'Phase 2 — Candidate Interview Shell' as const;
