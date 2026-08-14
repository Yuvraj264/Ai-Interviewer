import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  InterviewSession,
  CandidateProfile,
  JobProfile,
  CandidateJobProfile,
} from '@ai-interviewer/shared';
import {
  ResumeParser,
  JobDescriptionParser,
  CandidateJobMatcher,
  InterviewContextBuilder,
  BoundedInterviewContext,
} from '@ai-interviewer/interview-engine';

@Injectable()
export class InterviewsService {
  private sessions = new Map<string, InterviewSession>();
  private candidateProfiles = new Map<string, CandidateProfile>();
  private jobProfiles = new Map<string, JobProfile>();
  private matches = new Map<string, CandidateJobProfile>();
  private precomputedContexts = new Map<string, BoundedInterviewContext>();

  private resumeParser = new ResumeParser();
  private jdParser = new JobDescriptionParser();
  private matcher = new CandidateJobMatcher();
  private contextBuilder = new InterviewContextBuilder();

  createSession(payload: {
    candidateName: string;
    role: string;
    type?: 'technical' | 'behavioral' | 'mixed';
    durationMinutes?: number;
    resumeText?: string;
    jobDescriptionText?: string;
  }): InterviewSession {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const session: InterviewSession = {
      id,
      candidateName: payload.candidateName,
      role: payload.role,
      type: payload.type || 'technical',
      durationMinutes: payload.durationMinutes || 20,
      status: 'CREATED',
      currentStage: 'CREATED',
      createdAt: new Date().toISOString(),
      resumeText: payload.resumeText,
      jobDescriptionText: payload.jobDescriptionText,
    };
    this.sessions.set(id, session);

    // Auto-parse if initial resume/JD provided
    if (payload.resumeText) {
      this.parseResume(id, payload.resumeText);
    }
    if (payload.jobDescriptionText) {
      this.parseJobDescription(id, payload.jobDescriptionText);
    }

    return session;
  }

  getSession(id: string): InterviewSession {
    const session = this.sessions.get(id);
    if (!session) {
      throw new NotFoundException(`Interview session with ID '${id}' not found`);
    }
    return session;
  }

  startSession(id: string): InterviewSession {
    const session = this.getSession(id);
    if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
      throw new BadRequestException(`Cannot start interview session '${id}' with status '${session.status}'`);
    }

    session.status = 'IN_PROGRESS';
    session.currentStage = 'INTRO';
    session.startedAt = session.startedAt || new Date().toISOString();
    return session;
  }

  endSession(id: string): InterviewSession {
    const session = this.getSession(id);
    session.status = 'COMPLETED';
    session.currentStage = 'COMPLETED';
    session.completedAt = new Date().toISOString();
    return session;
  }

  parseResume(sessionId: string, resumeText: string): CandidateProfile {
    const session = this.getSession(sessionId);
    session.resumeText = resumeText;

    const profile = this.resumeParser.parseResume(resumeText, `cand_${sessionId}`, session.candidateName);
    this.candidateProfiles.set(sessionId, profile);

    this.recalculateMatch(sessionId);
    return profile;
  }

  parseJobDescription(sessionId: string, jdText: string): JobProfile {
    const session = this.getSession(sessionId);
    session.jobDescriptionText = jdText;

    const profile = this.jdParser.parseJobDescription(jdText, `job_${sessionId}`, session.role);
    this.jobProfiles.set(sessionId, profile);

    this.recalculateMatch(sessionId);
    return profile;
  }

  getProfile(sessionId: string): {
    candidateProfile?: CandidateProfile;
    jobProfile?: JobProfile;
    match?: CandidateJobProfile;
  } {
    this.getSession(sessionId); // Validates existence
    return {
      candidateProfile: this.candidateProfiles.get(sessionId),
      jobProfile: this.jobProfiles.get(sessionId),
      match: this.matches.get(sessionId),
    };
  }

  prepareInterview(sessionId: string): { match: CandidateJobProfile; turnContext: BoundedInterviewContext } {
    const session = this.getSession(sessionId);
    const cand = this.candidateProfiles.get(sessionId) || this.parseResume(sessionId, session.resumeText || `Name: ${session.candidateName}`);
    const job = this.jobProfiles.get(sessionId) || this.parseJobDescription(sessionId, session.jobDescriptionText || `Role: ${session.role}`);

    const match = this.recalculateMatch(sessionId);
    const turnContext = this.contextBuilder.buildTurnContext(cand, job, match);

    this.precomputedContexts.set(sessionId, turnContext);

    return { match, turnContext };
  }

  private recalculateMatch(sessionId: string): CandidateJobProfile {
    const session = this.getSession(sessionId);
    const cand = this.candidateProfiles.get(sessionId) || this.parseResume(sessionId, session.resumeText || `Name: ${session.candidateName}`);
    const job = this.jobProfiles.get(sessionId) || this.parseJobDescription(sessionId, session.jobDescriptionText || `Role: ${session.role}`);

    const match = this.matcher.matchCandidateToJob(cand, job);
    this.matches.set(sessionId, match);
    return match;
  }
}
