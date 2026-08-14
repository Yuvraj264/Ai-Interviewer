import { describe, it, expect } from 'vitest';
import { buildInterviewerInstructions } from './interviewer';

describe('buildInterviewerInstructions Prompt Module', () => {
  it('should generate instructions with fallback defaults when context is empty', () => {
    const prompt = buildInterviewerInstructions();
    expect(prompt).toContain('Candidate Name: Candidate');
    expect(prompt).toContain('Software Engineer');
    expect(prompt).toContain('Ask exactly ONE question at a time');
    expect(prompt).toContain('1 to 3 spoken sentences');
  });

  it('should interpolate candidate name, role, and interview type correctly', () => {
    const prompt = buildInterviewerInstructions({
      candidateName: 'Yuvraj',
      role: 'Lead AI Engineer',
      interviewType: 'behavioral',
    });
    expect(prompt).toContain('Candidate Name: Yuvraj');
    expect(prompt).toContain('Lead AI Engineer');
    expect(prompt).toContain('behavioral job interview');
  });
});
