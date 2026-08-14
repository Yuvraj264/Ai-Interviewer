import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import {
  ApiResponse,
  InterviewSession,
  CandidateProfile,
  JobProfile,
  CandidateJobProfile,
  InterviewEvaluation,
  HumanReview,
  HumanReviewOverride,
} from '@ai-interviewer/shared';
import { BoundedInterviewContext } from '@ai-interviewer/interview-engine';
import { InterviewsService } from './interviews.service';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  createSession(
    @Body()
    body: {
      candidateName: string;
      role: string;
      type?: 'technical' | 'behavioral' | 'mixed';
      durationMinutes?: number;
      resumeText?: string;
      jobDescriptionText?: string;
    }
  ): ApiResponse<InterviewSession> {
    const session = this.interviewsService.createSession(body);
    return {
      success: true,
      data: session,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  getSession(@Param('id') id: string): ApiResponse<InterviewSession> {
    const session = this.interviewsService.getSession(id);
    return {
      success: true,
      data: session,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/start')
  startSession(@Param('id') id: string): ApiResponse<InterviewSession> {
    const session = this.interviewsService.startSession(id);
    return {
      success: true,
      data: session,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/end')
  endSession(@Param('id') id: string): ApiResponse<InterviewSession> {
    const session = this.interviewsService.endSession(id);
    return {
      success: true,
      data: session,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/resume')
  parseResume(
    @Param('id') id: string,
    @Body() body: { resumeText: string }
  ): ApiResponse<CandidateProfile> {
    const profile = this.interviewsService.parseResume(id, body.resumeText);
    return {
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/jd')
  parseJobDescription(
    @Param('id') id: string,
    @Body() body: { jobDescriptionText: string }
  ): ApiResponse<JobProfile> {
    const profile = this.interviewsService.parseJobDescription(id, body.jobDescriptionText);
    return {
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id/profile')
  getProfile(@Param('id') id: string): ApiResponse<{
    candidateProfile?: CandidateProfile;
    jobProfile?: JobProfile;
    match?: CandidateJobProfile;
  }> {
    const profileData = this.interviewsService.getProfile(id);
    return {
      success: true,
      data: profileData,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/prepare')
  prepareInterview(@Param('id') id: string): ApiResponse<{
    match: CandidateJobProfile;
    turnContext: BoundedInterviewContext;
  }> {
    const preparedData = this.interviewsService.prepareInterview(id);
    return {
      success: true,
      data: preparedData,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/evaluate')
  evaluateSession(@Param('id') id: string): ApiResponse<InterviewEvaluation> {
    const evaluation = this.interviewsService.evaluateSession(id);
    return {
      success: true,
      data: evaluation,
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id/evaluation')
  getEvaluation(@Param('id') id: string): ApiResponse<InterviewEvaluation> {
    const evaluation = this.interviewsService.getEvaluation(id);
    return {
      success: true,
      data: evaluation,
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/evaluation/review')
  submitHumanReview(
    @Param('id') id: string,
    @Body()
    body: {
      reviewerId: string;
      reviewerName: string;
      humanOverrides: Record<string, HumanReviewOverride>;
      overallDecisionNote?: string;
    }
  ): ApiResponse<{ evaluation: InterviewEvaluation; review: HumanReview }> {
    const result = this.interviewsService.submitHumanReview(id, body);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }
}
