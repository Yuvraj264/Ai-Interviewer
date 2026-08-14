import { AiConversationState, InterviewEngineState, TranscriptItem, SystemHealth } from '@ai-interviewer/shared';
import { InterviewerPromptContext } from '@ai-interviewer/interview-engine';

interface LatencyTelemetry {
    candidateTurnEndTimestamp?: number;
    firstAiAudioTimestamp?: number;
    timeToFirstAudioMs?: number;
}
declare class RealtimeVoiceSession {
    readonly sessionId: string;
    readonly roomName: string;
    readonly agentIdentity: string;
    private engine;
    private conversationState;
    private transcript;
    private telemetry;
    constructor(sessionId: string, promptContext?: InterviewerPromptContext);
    startSession(): Promise<void>;
    speak(text: string): Promise<void>;
    handleCandidateTurnStarted(): void;
    handleCandidateTurnCompleted(candidateText: string): void;
    getState(): AiConversationState;
    getEngineState(): InterviewEngineState;
    getTranscript(): TranscriptItem[];
    getTelemetry(): LatencyTelemetry;
    stopSession(): Promise<void>;
}

interface AgentRoomSession {
    sessionId: string;
    roomName: string;
    agentIdentity: string;
    connectedAt: string;
    sessionInstance?: RealtimeVoiceSession;
}
interface AgentWorkerStatus {
    health: SystemHealth;
    livekitConnected: boolean;
    openaiConfigured: boolean;
    activeSessions: number;
    activeRooms: Array<Omit<AgentRoomSession, 'sessionInstance'>>;
}
declare class AgentWorker {
    private isRunning;
    private activeRooms;
    start(): Promise<void>;
    joinRoom(sessionId: string, context?: {
        candidateName?: string;
        role?: string;
        interviewType?: string;
    }): Promise<AgentRoomSession>;
    getSession(sessionId: string): RealtimeVoiceSession | undefined;
    leaveRoom(sessionId: string): Promise<void>;
    getStatus(): AgentWorkerStatus;
    stop(): Promise<void>;
}

export { type AgentRoomSession, AgentWorker, type AgentWorkerStatus };
