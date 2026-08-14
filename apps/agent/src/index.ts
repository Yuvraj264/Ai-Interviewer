import { getValidatedEnv } from '@ai-interviewer/config';
import { SystemHealth, PROJECT_PHASE } from '@ai-interviewer/shared';
import { RealtimeVoiceSession } from './realtime-session';

export interface AgentRoomSession {
  sessionId: string;
  roomName: string;
  agentIdentity: string;
  connectedAt: string;
  sessionInstance?: RealtimeVoiceSession;
}

export interface AgentWorkerStatus {
  health: SystemHealth;
  livekitConnected: boolean;
  openaiConfigured: boolean;
  activeSessions: number;
  activeRooms: Array<Omit<AgentRoomSession, 'sessionInstance'>>;
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
    console.log(`[Agent Worker] OpenAI Model: ${env.OPENAI_REALTIME_MODEL}, Voice: ${env.OPENAI_REALTIME_VOICE}`);
  }

  public async joinRoom(
    sessionId: string,
    context?: { candidateName?: string; role?: string; interviewType?: string },
  ): Promise<AgentRoomSession> {
    if (!this.isRunning) {
      throw new Error('AgentWorker must be started before joining rooms.');
    }

    const roomName = `interview:${sessionId}`;
    const agentIdentity = `agent-${sessionId}`;

    const realtimeSession = new RealtimeVoiceSession(sessionId, context);
    await realtimeSession.startSession();

    const sessionData: AgentRoomSession = {
      sessionId,
      roomName,
      agentIdentity,
      connectedAt: new Date().toISOString(),
      sessionInstance: realtimeSession,
    };

    this.activeRooms.set(sessionId, sessionData);
    console.log(`[Agent Worker] [realtime.agent.joined] Room: ${roomName}, Identity: ${agentIdentity}`);
    return sessionData;
  }

  public getSession(sessionId: string): RealtimeVoiceSession | undefined {
    return this.activeRooms.get(sessionId)?.sessionInstance;
  }

  public async leaveRoom(sessionId: string): Promise<void> {
    const room = this.activeRooms.get(sessionId);
    if (room) {
      if (room.sessionInstance) {
        await room.sessionInstance.stopSession();
      }
      this.activeRooms.delete(sessionId);
      console.log(`[Agent Worker] [realtime.agent.left] Room: ${room.roomName}, Identity: ${room.agentIdentity}`);
    }
  }

  public getStatus(): AgentWorkerStatus {
    const env = getValidatedEnv();
    const isLiveKitConfigured = Boolean(env.LIVEKIT_URL);
    const isOpenAiConfigured = Boolean(env.OPENAI_REALTIME_MODEL);

    return {
      health: {
        status: this.isRunning ? 'ok' : 'down',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
        service: 'agent-worker',
      },
      livekitConnected: this.isRunning && isLiveKitConfigured,
      openaiConfigured: isOpenAiConfigured,
      activeSessions: this.activeRooms.size,
      activeRooms: Array.from(this.activeRooms.values()).map(({ sessionInstance: _, ...rest }) => rest),
    };
  }

  public async stop(): Promise<void> {
    for (const sessionId of Array.from(this.activeRooms.keys())) {
      await this.leaveRoom(sessionId);
    }
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
