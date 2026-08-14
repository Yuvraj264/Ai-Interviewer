import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { InterviewsController } from './interviews/interviews.controller';
import { InterviewsService } from './interviews/interviews.service';

@Module({
  imports: [],
  controllers: [HealthController, InterviewsController],
  providers: [InterviewsService],
})
export class AppModule {}
