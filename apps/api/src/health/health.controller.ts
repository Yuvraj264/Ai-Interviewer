import { Controller, Get } from '@nestjs/common';
import { ApiResponse, SystemHealth, DeepHealthStatus, PROJECT_PHASE } from '@ai-interviewer/shared';

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
  getReadiness(): ApiResponse<DeepHealthStatus> {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);

    const services = {
      database: true,
      redis: true,
      livekit: Boolean(process.env.LIVEKIT_API_KEY),
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
}
