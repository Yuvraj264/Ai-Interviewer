export * from './session.schema';

export type SessionStatus = 'CREATED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InterviewStage =
  | 'CREATED'
  | 'WAITING'
  | 'INTRO'
  | 'BACKGROUND'
  | 'PROJECT_DEEP_DIVE'
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'CLOSING'
  | 'COMPLETING'
  | 'COMPLETION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

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

export type RealtimeConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'FAILED';

export type MicrophoneState = 'IDLE' | 'REQUESTING' | 'ACTIVE' | 'DENIED' | 'ERROR';

export type AiConversationState =
  | 'IDLE'
  | 'CONNECTING'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'RECONNECTING'
  | 'ERROR'
  | 'ENDING';

export type EngineQuestionState =
  | 'CREATED'
  | 'ASKING'
  | 'WAITING_FOR_ANSWER'
  | 'ANSWERING'
  | 'ANSWER_RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type EngineEventType =
  | 'INTERVIEW_STARTED'
  | 'QUESTION_STARTED'
  | 'CANDIDATE_ANSWER_RECEIVED'
  | 'QUESTION_COMPLETED'
  | 'STAGE_COMPLETED'
  | 'TIME_LIMIT_REACHED'
  | 'QUESTION_LIMIT_REACHED'
  | 'INTERVIEW_ENDED'
  | 'INTERVIEW_CANCELLED';

export interface EngineQuestion {
  id: string;
  stage: InterviewStage;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  objective: string;
}

export interface InterviewConfig {
  type: InterviewType;
  durationMinutes: number;
  maxQuestions: number;
  stages: InterviewStage[];
  topics: string[];
  difficulty: string;
}

export interface InterviewEngineState {
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

export interface TranscriptItem {
  id: string;
  speaker: 'ai' | 'candidate';
  text: string;
  timestamp: string;
}

export interface RealtimeTokenResponse {
  token: string;
  url: string;
  roomName: string;
  participantIdentity: string;
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

export const PROJECT_PHASE = 'Phase 5 — Interview State Machine & Interview Engine' as const;
