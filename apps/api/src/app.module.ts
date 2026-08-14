import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { InterviewsController } from './interviews/interviews.controller';
import { InterviewsService } from './interviews/interviews.service';
import { RealtimeService } from './interviews/realtime.service';

@Module({
  imports: [],
  controllers: [HealthController, InterviewsController],
  providers: [InterviewsService, RealtimeService],
})
export class AppModule {}
