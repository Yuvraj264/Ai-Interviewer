import { Controller, Post, Get } from '@nestjs/common';
import {
  ApiResponse,
  DemoResetResponse,
  DEMO_SYNTHETIC_CANDIDATE,
  DEMO_SYNTHETIC_JOB,
  PROJECT_PHASE,
} from '@ai-interviewer/shared';
import { InterviewsService } from '../interviews/interviews.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post('reset')
  resetDemo(): ApiResponse<DemoResetResponse> {
    const session = this.interviewsService.createSession({
      candidateName: DEMO_SYNTHETIC_CANDIDATE.name || 'Alex Mercer',
      role: DEMO_SYNTHETIC_JOB.title,
      type: 'technical',
      durationMinutes: 20,
      resumeText: `Name: ${DEMO_SYNTHETIC_CANDIDATE.name}\nHeadline: ${DEMO_SYNTHETIC_CANDIDATE.headline}\nSummary: ${DEMO_SYNTHETIC_CANDIDATE.summary}\nExperience: PrimeBank microservices, PostgreSQL B-tree indexing, Redis write-through caching.`,
      jobDescriptionText: `Title: ${DEMO_SYNTHETIC_JOB.title}\nRequirements: PostgreSQL transaction isolation, Redis caching, System Design microservices.`,
    });

    this.interviewsService.prepareInterview(session.id);
    this.interviewsService.evaluateSession(session.id);

    return {
      success: true,
      data: {
        success: true,
        sessionId: session.id,
        message: `Demo environment reset cleanly. Synthetic candidate Alex Mercer prepared for session ${session.id}.`,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('status')
  getDemoStatus(): ApiResponse<{ ready: boolean; phase: string; activeDemoCandidate: string }> {
    return {
      success: true,
      data: {
        ready: true,
        phase: PROJECT_PHASE,
        activeDemoCandidate: DEMO_SYNTHETIC_CANDIDATE.name || 'Alex Mercer',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
