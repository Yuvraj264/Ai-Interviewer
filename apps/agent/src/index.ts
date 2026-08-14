import { getValidatedEnv } from '@ai-interviewer/config';
import { SystemHealth, PROJECT_PHASE } from '@ai-interviewer/shared';

export interface AgentWorkerStatus {
  health: SystemHealth;
  livekitConnected: boolean;
  activeSessions: number;
}

export class AgentWorker {
  private isRunning = false;

  public async start(): Promise<void> {
    const env = getValidatedEnv();
    this.isRunning = true;
    console.log(`[Agent Worker Shell] Initialized in ${env.NODE_ENV} mode.`);
    console.log(`[Agent Worker Shell] Phase: ${PROJECT_PHASE}`);
    console.log(`[Agent Worker Shell] LiveKit connection disabled in Phase 1.`);
  }

  public getStatus(): AgentWorkerStatus {
    return {
      health: {
        status: this.isRunning ? 'ok' : 'down',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        service: 'agent-worker',
      },
      livekitConnected: false,
      activeSessions: 0,
    };
  }

  public async stop(): Promise<void> {
    this.isRunning = false;
    console.log('[Agent Worker Shell] Stopped worker process.');
  }
}

if (require.main === module) {
  const worker = new AgentWorker();
  worker.start().catch((err) => {
    console.error('[Agent Worker Shell] Error during start:', err);
    process.exit(1);
  });
}
