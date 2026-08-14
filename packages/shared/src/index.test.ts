import { describe, it, expect } from 'vitest';
import {
  PROJECT_PHASE,
  InterviewStage,
  CandidateProfile,
  JobProfile,
  CandidateJobProfile,
} from './index';

describe('Shared Package Phase 7 Intelligence Contracts', () => {
  it('should export current Phase 7 project phase constant', () => {
    expect(PROJECT_PHASE).toBe('Phase 7 — Resume + Job Description Intelligence');
  });

  it('should support valid InterviewStage enum values', () => {
    const stages: InterviewStage[] = [
      'CREATED',
      'WAITING',
      'INTRO',
      'BACKGROUND',
      'PROJECT_DEEP_DIVE',
      'TECHNICAL',
      'BEHAVIORAL',
      'CLOSING',
      'COMPLETING',
      'COMPLETED',
      'CANCELLED',
      'FAILED',
    ];
    expect(stages.length).toBe(12);
  });

  it('should validate CandidateProfile, JobProfile, and CandidateJobProfile contracts', () => {
    const candidateProfile: CandidateProfile = {
      candidateId: 'cand_123',
      name: 'Sam Developer',
      headline: 'Full Stack Engineer',
      education: [],
      experience: [],
      projects: [{ name: 'PrimeBank', description: 'Banking System', technologies: ['Spring Boot', 'PostgreSQL', 'Redis'] }],
      skills: [{ canonicalName: 'Node.js', rawName: 'Node JS', category: 'FRAMEWORK', source: 'resume', evidence: 'Built microservices', verificationStatus: 'UNVERIFIED' }],
    };

    const jobProfile: JobProfile = {
      jobId: 'job_456',
      title: 'Backend Engineer',
      requiredSkills: [{ skill: 'Node.js', importance: 'CORE', isRequired: true }],
      preferredSkills: [{ skill: 'Redis', importance: 'IMPORTANT', isRequired: false }],
      responsibilities: ['Build REST APIs'],
      qualifications: ['B.S. CS'],
      domains: ['fintech'],
    };

    const match: CandidateJobProfile = {
      candidateId: 'cand_123',
      jobId: 'job_456',
      matchedSkills: ['Node.js'],
      missingSkills: [],
      unverifiedSkills: ['Node.js', 'Redis'],
      relevantProjects: candidateProfile.projects,
      interviewTargets: [
        {
          id: 'target_1',
          type: 'VERIFY_RESUME_CLAIM',
          topic: 'Node.js',
          reason: 'Verify Node.js experience claimed on resume',
          priority: 'HIGH',
          verificationGoal: 'Confirm async I/O understanding',
          status: 'PENDING',
        },
      ],
    };

    expect(candidateProfile.skills[0].verificationStatus).toBe('UNVERIFIED');
    expect(jobProfile.requiredSkills[0].isRequired).toBe(true);
    expect(match.interviewTargets.length).toBe(1);
  });
});
