import { describe, it, expect, beforeEach } from 'vitest';
import { MockInterviewer } from './index';

describe('MockInterviewer Engine Foundation', () => {
  let interviewer: MockInterviewer;

  beforeEach(() => {
    interviewer = new MockInterviewer('technical');
  });

  it('should initialize at question 0 with 25% progress', async () => {
    await interviewer.start();
    const state = interviewer.getState();
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.totalQuestions).toBe(4);
    expect(state.progressPercentage).toBe(25);
    expect(state.isCompleted).toBe(false);
    expect(state.currentQuestion).toContain('Welcome!');
  });

  it('should advance question step upon candidate response submission', async () => {
    await interviewer.start();
    await interviewer.submitCandidateResponse('Here is my answer to question 1.');
    const state = interviewer.getState();
    expect(state.currentQuestionIndex).toBe(1);
    expect(state.progressPercentage).toBe(50);
    expect(state.currentQuestion).toContain('challenging technical problem');
  });

  it('should invoke callbacks when question changes', async () => {
    let capturedQuestion = '';
    interviewer.onQuestionChange((q) => {
      capturedQuestion = q;
    });
    await interviewer.start();
    expect(capturedQuestion).toContain('Welcome!');
    await interviewer.submitCandidateResponse('Answer 1');
    expect(capturedQuestion).toContain('challenging technical problem');
  });

  it('should transition to completed state when reaching last question or calling end()', async () => {
    await interviewer.start();
    await interviewer.end();
    const state = interviewer.getState();
    expect(state.isCompleted).toBe(true);
    expect(state.progressPercentage).toBe(100);
  });
});
