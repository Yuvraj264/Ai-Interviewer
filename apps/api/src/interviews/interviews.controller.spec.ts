import { describe, it, expect, beforeEach } from 'vitest';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

describe('InterviewsController Phase 7 Intelligence Endpoints', () => {
  let controller: InterviewsController;
  let service: InterviewsService;

  beforeEach(() => {
    service = new InterviewsService();
    controller = new InterviewsController(service);
  });

  it('should create interview session with resume and JD text', () => {
    const response = controller.createSession({
      candidateName: 'Sam Developer',
      role: 'Staff Engineer',
      type: 'technical',
      durationMinutes: 20,
      resumeText: 'Built PrimeBank using Spring Boot, PostgreSQL, and Redis.',
      jobDescriptionText: 'Required: PostgreSQL and Node.js.',
    });

    expect(response.success).toBe(true);
    expect(response.data?.id).toBeDefined();
    expect(response.data?.status).toBe('CREATED');
  });

  it('should support posting resume, job description, and preparing interview targets', () => {
    const createRes = controller.createSession({
      candidateName: 'Sam Developer',
      role: 'Backend Engineer',
    });
    const id = createRes.data!.id;

    const resumeRes = controller.parseResume(id, { resumeText: 'Built PrimeBank using Spring Boot, PostgreSQL, and Redis.' });
    expect(resumeRes.success).toBe(true);
    expect(resumeRes.data?.skills.length).toBeGreaterThan(0);

    const jdRes = controller.parseJobDescription(id, { jobDescriptionText: 'Required: PostgreSQL and Redis.' });
    expect(jdRes.success).toBe(true);
    expect(jdRes.data?.requiredSkills.length).toBeGreaterThan(0);

    const profileRes = controller.getProfile(id);
    expect(profileRes.success).toBe(true);
    expect(profileRes.data?.candidateProfile).toBeDefined();

    const prepRes = controller.prepareInterview(id);
    expect(prepRes.success).toBe(true);
    expect(prepRes.data?.match.interviewTargets.length).toBeGreaterThan(0);
    expect(prepRes.data?.turnContext.candidateSummary).toBeDefined();
  });
});
