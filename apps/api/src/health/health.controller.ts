import { Controller, Get } from '@nestjs/common';
import { ApiResponse, SystemHealth, DeepHealthStatus, PROJECT_PHASE } from '@ai-interviewer/shared';
import { getValidatedEnv } from '@ai-interviewer/config';

@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  getHealth(): ApiResponse<SystemHealth> {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    return {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: uptimeSeconds,
        environment: process.env.NODE_ENV || 'development',
        service: PROJECT_PHASE,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('readiness')
  async getReadiness(): Promise<ApiResponse<DeepHealthStatus>> {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const livekitReachable = await this.checkLivekitReachable();

    const services = {
      database: true,
      redis: true,
      livekit: livekitReachable,
    };

    const isAllOk = Object.values(services).every(Boolean);

    return {
      success: true,
      data: {
        status: isAllOk ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: uptimeSeconds,
        environment: process.env.NODE_ENV || 'development',
        service: PROJECT_PHASE,
        services,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('realtime')
  async getRealtimeHealth(): Promise<
    ApiResponse<{ status: 'LIVEKIT_REACHABLE' | 'LIVEKIT_UNAVAILABLE'; url: string }>
  > {
    const env = getValidatedEnv();
    const isReachable = await this.checkLivekitReachable();

    return {
      success: true,
      data: {
        status: isReachable ? 'LIVEKIT_REACHABLE' : 'LIVEKIT_UNAVAILABLE',
        url: env.LIVEKIT_URL,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private async checkLivekitReachable(): Promise<boolean> {
    try {
      const env = getValidatedEnv();
      const httpUrl = env.LIVEKIT_URL.replace('ws://', 'http://').replace('wss://', 'https://');
      const res = await fetch(httpUrl, { method: 'GET' });
      return res.status === 200 || res.status === 404;
    } catch {
      return false;
    }
  }
}
