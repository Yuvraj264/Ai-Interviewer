import { describe, it, expect, beforeEach } from 'vitest';
import { MockInterviewer } from './index';

describe('MockInterviewer Engine Foundation', () => {
  let interviewer: MockInterviewer;

  beforeEach(() => {
    interviewer = new MockInterviewer('technical');
  });

  it('should initialize at question 0 with 0% progress', async () => {
    await interviewer.start();
    const state = interviewer.getState();
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.totalQuestions).toBe(3);
    expect(state.progressPercentage).toBe(0);
    expect(state.isCompleted).toBe(false);
    expect(state.currentQuestion).toContain('Welcome!');
  });

  it('should advance question step upon candidate response submission', async () => {
    await interviewer.start();
    await interviewer.submitCandidateResponse('Here is my answer to question 1.');
    const state = interviewer.getState();
    expect(state.currentQuestionIndex).toBe(1);
    expect(state.progressPercentage).toBe(33);
    expect(state.currentQuestion).toContain('challenging technical project');
  });

  it('should invoke state change callbacks on updates', async () => {
    let capturedQuestion = '';
    interviewer.onStateChange((st) => {
      capturedQuestion = st.currentQuestion;
    });
    await interviewer.start();
    expect(capturedQuestion).toContain('Welcome!');
    await interviewer.submitCandidateResponse('Answer 1');
    expect(capturedQuestion).toContain('challenging technical project');
  });

  it('should transition to completed state when calling end()', async () => {
    await interviewer.start();
    await interviewer.end();
    const state = interviewer.getState();
    expect(state.isCompleted).toBe(true);
    expect(state.progressPercentage).toBe(100);
  });
});
