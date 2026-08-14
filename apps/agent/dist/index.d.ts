import { SystemHealth } from '@ai-interviewer/shared';

interface AgentRoomSession {
    sessionId: string;
    roomName: string;
    agentIdentity: string;
    connectedAt: string;
}
interface AgentWorkerStatus {
    health: SystemHealth;
    livekitConnected: boolean;
    activeSessions: number;
    activeRooms: AgentRoomSession[];
}
declare class AgentWorker {
    private isRunning;
    private activeRooms;
    start(): Promise<void>;
    joinRoom(sessionId: string): Promise<AgentRoomSession>;
    leaveRoom(sessionId: string): Promise<void>;
    getStatus(): AgentWorkerStatus;
    stop(): Promise<void>;
}

export { type AgentRoomSession, AgentWorker, type AgentWorkerStatus };
