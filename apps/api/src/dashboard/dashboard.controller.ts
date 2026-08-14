import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiResponse,
  CandidateProfile,
  JobProfile,
  CandidateJobProfile,
  InterviewSession,
  InterviewEvaluation,
  DashboardOverviewMetrics,
  AnalyticsData,
  PaginatedResponse,
} from '@ai-interviewer/shared';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@Query('orgId') orgId?: string): ApiResponse<DashboardOverviewMetrics> {
    const overview = this.dashboardService.getOverview(orgId);
    return {
      success: true,
      data: overview,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('candidates')
  getCandidates(
    @Query('query') query?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('orgId') orgId?: string
  ): ApiResponse<PaginatedResponse<CandidateProfile>> {
    const paginated = this.dashboardService.getCandidates(query, Number(page), Number(limit), orgId);
    return {
      success: true,
      data: paginated,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('candidates/:id')
  getCandidateById(
    @Param('id') id: string
  ): ApiResponse<{ candidate: CandidateProfile; matches: CandidateJobProfile[] }> {
    const result = this.dashboardService.getCandidateById(id);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('interviews')
  getInterviews(
    @Query('status') status?: string,
    @Query('query') query?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('orgId') orgId?: string
  ): ApiResponse<PaginatedResponse<InterviewSession>> {
    const paginated = this.dashboardService.getInterviews(status, query, Number(page), Number(limit), orgId);
    return {
      success: true,
      data: paginated,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('interviews/:id')
  getInterviewById(@Param('id') id: string): ApiResponse<{
    session: InterviewSession;
    profile?: CandidateProfile;
    job?: JobProfile;
    evaluation?: InterviewEvaluation;
  }> {
    const result = this.dashboardService.getInterviewById(id);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('jobs')
  getJobs(@Query('orgId') orgId?: string): ApiResponse<JobProfile[]> {
    const jobs = this.dashboardService.getJobs(orgId);
    return {
      success: true,
      data: jobs,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('analytics')
  getAnalytics(@Query('orgId') orgId?: string): ApiResponse<AnalyticsData> {
    const analytics = this.dashboardService.getAnalytics(orgId);
    return {
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    };
  }
}
