import { SystemHealth } from '@ai-interviewer/shared';

interface AgentWorkerStatus {
    health: SystemHealth;
    livekitConnected: boolean;
    activeSessions: number;
}
declare class AgentWorker {
    private isRunning;
    start(): Promise<void>;
    getStatus(): AgentWorkerStatus;
    stop(): Promise<void>;
}

export { AgentWorker, type AgentWorkerStatus };
