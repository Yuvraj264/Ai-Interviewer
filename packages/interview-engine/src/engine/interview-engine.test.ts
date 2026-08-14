import { describe, it, expect, beforeEach } from 'vitest';
import { InterviewEngine } from './interview-engine';
import { InvalidTransitionError, InterviewAlreadyCompletedError } from './domain-errors';

describe('InterviewEngine State Machine', () => {
  let engine: InterviewEngine;

  beforeEach(() => {
    engine = new InterviewEngine('sess_engine_123', { maxQuestions: 4 });
  });

  it('should initialize at CREATED stage and transition cleanly to INTRO on start', () => {
    const state = engine.startInterview();
    expect(state.sessionId).toBe('sess_engine_123');
    expect(state.status).toBe('IN_PROGRESS');
    expect(state.stage).toBe('INTRO');
    expect(state.currentQuestion?.stage).toBe('INTRO');
    expect(state.questionsAsked).toBe(1);
    expect(state.questionsRemaining).toBe(3);
  });

  it('should advance question lifecycle and covered topics upon submitting answers', () => {
    engine.startInterview();
    const q1 = engine.getState().currentQuestion!;

    const stateAfterAnswer = engine.submitAnswer(q1.id, 'I have 5 years experience in React and Node.');
    expect(stateAfterAnswer.coveredTopics).toContain(q1.topic);

    const nextQ = engine.nextQuestion();
    expect(nextQ).toBeDefined();
    expect(nextQ!.id).not.toBe(q1.id);
  });

  it('should reject invalid stage transitions with InvalidTransitionError', () => {
    engine.startInterview();
    engine.completeInterview();

    expect(() => engine.transition('TECHNICAL')).toThrow(InvalidTransitionError);
  });

  it('should reject operations on already completed interview with InterviewAlreadyCompletedError', () => {
    engine.startInterview();
    engine.completeInterview();

    expect(() => engine.nextQuestion()).toThrow(InterviewAlreadyCompletedError);
    expect(() => engine.submitAnswer('q_intro_01', 'answer')).toThrow(InterviewAlreadyCompletedError);
  });

  it('should enforce question budget limit strictly', () => {
    const shortEngine = new InterviewEngine('sess_short', { maxQuestions: 2 });
    shortEngine.startInterview(); // Asked 1
    const state1 = shortEngine.getState();
    expect(state1.questionsAsked).toBe(1);

    const q2 = shortEngine.nextQuestion(); // Asked 2
    expect(q2).toBeDefined();

    const q3 = shortEngine.nextQuestion(); // Exceeds maxQuestions 2 -> completes
    expect(q3).toBeNull();
    expect(shortEngine.getState().isCompleted).toBe(true);
  });

  it('should guarantee multi-session isolation between concurrent sessions', () => {
    const engineA = new InterviewEngine('sess_A', { maxQuestions: 3 });
    const engineB = new InterviewEngine('sess_B', { maxQuestions: 5 });

    engineA.startInterview();
    engineB.startInterview();

    expect(engineA.getState().questionsRemaining).toBe(2);
    expect(engineB.getState().questionsRemaining).toBe(4);

    engineA.completeInterview();

    expect(engineA.getState().isCompleted).toBe(true);
    expect(engineB.getState().isCompleted).toBe(false);
  });
});
