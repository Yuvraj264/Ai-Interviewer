import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { InterviewsController } from './interviews/interviews.controller';
import { InterviewsService } from './interviews/interviews.service';
import { RealtimeService } from './interviews/realtime.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DemoController } from './demo/demo.controller';
import { SafetyController } from './safety/safety.controller';

@Module({
  imports: [],
  controllers: [HealthController, InterviewsController, DashboardController, DemoController, SafetyController],
  providers: [InterviewsService, RealtimeService, DashboardService],
})
export class AppModule {}
