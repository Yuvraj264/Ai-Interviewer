import { getValidatedEnv } from '@ai-interviewer/config';
import { SystemHealth, PROJECT_PHASE } from '@ai-interviewer/shared';

export interface AgentRoomSession {
  sessionId: string;
  roomName: string;
  agentIdentity: string;
  connectedAt: string;
}

export interface AgentWorkerStatus {
  health: SystemHealth;
  livekitConnected: boolean;
  activeSessions: number;
  activeRooms: AgentRoomSession[];
}

export class AgentWorker {
  private isRunning = false;
  private activeRooms = new Map<string, AgentRoomSession>();

  public async start(): Promise<void> {
    const env = getValidatedEnv();
    this.isRunning = true;
    console.log(`[Agent Worker] Initialized in ${env.NODE_ENV} mode.`);
    console.log(`[Agent Worker] Phase: ${PROJECT_PHASE}`);
    console.log(`[Agent Worker] LiveKit URL: ${env.LIVEKIT_URL}`);
  }

  public async joinRoom(sessionId: string): Promise<AgentRoomSession> {
    if (!this.isRunning) {
      throw new Error('AgentWorker must be started before joining rooms.');
    }

    const roomName = `interview:${sessionId}`;
    const agentIdentity = `agent-${sessionId}`;

    const sessionData: AgentRoomSession = {
      sessionId,
      roomName,
      agentIdentity,
      connectedAt: new Date().toISOString(),
    };

    this.activeRooms.set(sessionId, sessionData);
    console.log(`[Agent Worker] [realtime.agent.joined] Room: ${roomName}, Identity: ${agentIdentity}`);
    return sessionData;
  }

  public async leaveRoom(sessionId: string): Promise<void> {
    const room = this.activeRooms.get(sessionId);
    if (room) {
      this.activeRooms.delete(sessionId);
      console.log(`[Agent Worker] [realtime.agent.left] Room: ${room.roomName}, Identity: ${room.agentIdentity}`);
    }
  }

  public getStatus(): AgentWorkerStatus {
    const isLiveKitConfigured = Boolean(process.env.LIVEKIT_URL || 'ws://localhost:7880');
    return {
      health: {
        status: this.isRunning ? 'ok' : 'down',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        service: 'agent-worker',
      },
      livekitConnected: this.isRunning && isLiveKitConfigured,
      activeSessions: this.activeRooms.size,
      activeRooms: Array.from(this.activeRooms.values()),
    };
  }

  public async stop(): Promise<void> {
    this.activeRooms.clear();
    this.isRunning = false;
    console.log('[Agent Worker] Stopped worker process.');
  }
}

if (require.main === module) {
  const worker = new AgentWorker();
  worker.start().catch((err) => {
    console.error('[Agent Worker] Error during start:', err);
    process.exit(1);
  });
}
