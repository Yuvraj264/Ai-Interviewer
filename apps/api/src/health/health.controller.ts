import { Controller, Get } from '@nestjs/common';
import { SystemHealth, PROJECT_PHASE } from '@ai-interviewer/shared';
import { getValidatedEnv } from '@ai-interviewer/config';

@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  @Get()
  getHealth(): SystemHealth & { phase: string } {
    const env = getValidatedEnv();
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      environment: env.NODE_ENV,
      service: 'api',
      phase: PROJECT_PHASE,
    };
  }
}
