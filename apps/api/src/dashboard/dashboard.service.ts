import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InterviewSession,
  CandidateProfile,
  JobProfile,
  CandidateJobProfile,
  InterviewEvaluation,
  DashboardOverviewMetrics,
  AnalyticsData,
  PaginatedResponse,
} from '@ai-interviewer/shared';
import { AnalyticsService } from '@ai-interviewer/interview-engine';
import { InterviewsService } from '../interviews/interviews.service';

@Injectable()
export class DashboardService {
  private analyticsService = new AnalyticsService();

  constructor(private readonly interviewsService: InterviewsService) {}

  getOverview(organizationId?: string): DashboardOverviewMetrics {
    const sessions = this.interviewsService.getAllSessions();
    const evaluations = this.interviewsService.getAllEvaluations();

    return this.analyticsService.calculateOverviewMetrics(sessions, evaluations, organizationId);
  }

  getCandidates(
    query?: string,
    page = 1,
    limit = 10,
    organizationId?: string
  ): PaginatedResponse<CandidateProfile> {
    const profiles = this.interviewsService.getAllCandidateProfiles();
    let filtered = organizationId
      ? profiles.filter((p) => !p.organizationId || p.organizationId === organizationId)
      : profiles;

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.headline?.toLowerCase().includes(q) ||
          p.skills.some((s) => s.rawName.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return { items, total, page, limit, totalPages };
  }

  getCandidateById(candidateId: string): { candidate: CandidateProfile; matches: CandidateJobProfile[] } {
    const profiles = this.interviewsService.getAllCandidateProfiles();
    const candidate = profiles.find((p) => p.candidateId === candidateId);
    if (!candidate) {
      throw new NotFoundException(`Candidate profile '${candidateId}' not found`);
    }

    const matches = this.interviewsService.getMatchesForCandidate(candidateId);
    return { candidate, matches };
  }

  getInterviews(
    status?: string,
    query?: string,
    page = 1,
    limit = 10,
    organizationId?: string
  ): PaginatedResponse<InterviewSession> {
    let sessions = this.interviewsService.getAllSessions();
    if (organizationId) {
      sessions = sessions.filter((s) => !s.organizationId || s.organizationId === organizationId);
    }
    if (status) {
      sessions = sessions.filter((s) => s.status === status);
    }
    if (query) {
      const q = query.toLowerCase();
      sessions = sessions.filter(
        (s) => s.candidateName.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      );
    }

    const total = sessions.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = sessions.slice(startIndex, startIndex + limit);

    return { items, total, page, limit, totalPages };
  }

  getInterviewById(sessionId: string): {
    session: InterviewSession;
    profile?: CandidateProfile;
    job?: JobProfile;
    evaluation?: InterviewEvaluation;
  } {
    const session = this.interviewsService.getSession(sessionId);
    const profileData = this.interviewsService.getProfile(sessionId);
    const evaluation = this.interviewsService.getEvaluation(sessionId);

    return {
      session,
      profile: profileData.candidateProfile,
      job: profileData.jobProfile,
      evaluation,
    };
  }

  getJobs(organizationId?: string): JobProfile[] {
    const jobs = this.interviewsService.getAllJobProfiles();
    return organizationId ? jobs.filter((j) => !j.organizationId || j.organizationId === organizationId) : jobs;
  }

  getAnalytics(organizationId?: string): AnalyticsData {
    const sessions = this.interviewsService.getAllSessions();
    const evaluations = this.interviewsService.getAllEvaluations();
    const adaptiveRecords = this.interviewsService.getAllAdaptiveRecords();

    return this.analyticsService.calculateAnalyticsData(sessions, evaluations, adaptiveRecords, organizationId);
  }
}
