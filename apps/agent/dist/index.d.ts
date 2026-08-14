import { AiConversationState, InterviewEngineState, TranscriptItem, AdaptiveDecisionRecord, SystemHealth } from '@ai-interviewer/shared';
import { InterviewerPromptContext, BoundedInterviewContext } from '@ai-interviewer/interview-engine';

interface LatencyTelemetry {
    candidateTurnEndTimestamp?: number;
    analysisLatencyMs?: number;
    decisionLatencyMs?: number;
    totalAdaptiveLatencyMs?: number;
    firstAiAudioTimestamp?: number;
    timeToFirstAudioMs?: number;
}
declare class RealtimeVoiceSession {
    readonly sessionId: string;
    readonly roomName: string;
    readonly agentIdentity: string;
    private engine;
    private adaptiveEngine;
    private contextBuilder;
    private candidateProfile;
    private jobProfile;
    private match;
    private conversationState;
    private transcript;
    private telemetry;
    private adaptiveRecords;
    private signalHistory;
    constructor(sessionId: string, promptContext?: InterviewerPromptContext & {
        resumeText?: string;
        jobDescriptionText?: string;
    });
    startSession(): Promise<void>;
    speak(text: string): Promise<void>;
    handleCandidateTurnStarted(): void;
    handleCandidateTurnCompleted(candidateText: string): Promise<void>;
    getState(): AiConversationState;
    getEngineState(): InterviewEngineState;
    getTranscript(): TranscriptItem[];
    getAdaptiveRecords(): AdaptiveDecisionRecord[];
    getTurnContext(): BoundedInterviewContext;
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
        resumeText?: string;
        jobDescriptionText?: string;
    }): Promise<AgentRoomSession>;
    getSession(sessionId: string): RealtimeVoiceSession | undefined;
    leaveRoom(sessionId: string): Promise<void>;
    getStatus(): AgentWorkerStatus;
    stop(): Promise<void>;
}

export { type AgentRoomSession, AgentWorker, type AgentWorkerStatus };
