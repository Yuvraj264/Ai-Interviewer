import {
  InterviewStage,
  SessionStatus,
  EngineQuestion,
  EngineQuestionState,
  InterviewConfig,
  InterviewEngineState,
} from '@ai-interviewer/shared';
import { getQuestionsForType } from '../bank/questions';
import {
  InvalidTransitionError,
  InterviewAlreadyCompletedError,
} from './domain-errors';

const ALLOWED_TRANSITIONS: Record<InterviewStage, InterviewStage[]> = {
  CREATED: ['WAITING', 'CANCELLED', 'FAILED'],
  WAITING: ['INTRO', 'CANCELLED', 'FAILED'],
  INTRO: ['BACKGROUND', 'PROJECT_DEEP_DIVE', 'TECHNICAL', 'BEHAVIORAL', 'CLOSING', 'CANCELLED', 'FAILED'],
  BACKGROUND: ['PROJECT_DEEP_DIVE', 'TECHNICAL', 'BEHAVIORAL', 'CLOSING', 'CANCELLED', 'FAILED'],
  PROJECT_DEEP_DIVE: ['TECHNICAL', 'BEHAVIORAL', 'CLOSING', 'CANCELLED', 'FAILED'],
  TECHNICAL: ['BEHAVIORAL', 'CLOSING', 'CANCELLED', 'FAILED'],
  BEHAVIORAL: ['CLOSING', 'CANCELLED', 'FAILED'],
  CLOSING: ['COMPLETING', 'COMPLETION', 'COMPLETED', 'CANCELLED', 'FAILED'],
  COMPLETING: ['COMPLETION', 'COMPLETED', 'CANCELLED', 'FAILED'],
  COMPLETION: ['COMPLETED', 'CANCELLED', 'FAILED'],
  COMPLETED: [],
  CANCELLED: [],
  FAILED: [],
};

const STAGE_ORDER: InterviewStage[] = [
  'INTRO',
  'BACKGROUND',
  'PROJECT_DEEP_DIVE',
  'TECHNICAL',
  'BEHAVIORAL',
  'CLOSING',
];

export class InterviewEngine {
  public readonly sessionId: string;
  private config: InterviewConfig;
  private status: SessionStatus = 'CREATED';
  private stage: InterviewStage = 'CREATED';
  private currentQuestion?: EngineQuestion;
  private currentQuestionState?: EngineQuestionState;
  private coveredTopics: Set<string> = new Set();
  private askedQuestionIds: Set<string> = new Set();
  private startedAtTimestamp?: number;
  private isCompleted = false;

  constructor(sessionId: string, config?: Partial<InterviewConfig>) {
    this.sessionId = sessionId;
    this.config = {
      type: config?.type || 'technical',
      durationMinutes: config?.durationMinutes || 20,
      maxQuestions: config?.maxQuestions || 6,
      stages: config?.stages || ['INTRO', 'BACKGROUND', 'PROJECT_DEEP_DIVE', 'TECHNICAL', 'CLOSING'],
      topics: config?.topics || ['introduction', 'career-history', 'architecture', 'rest-api', 'databases', 'conclusion'],
      difficulty: config?.difficulty || 'medium',
    };
  }

  public startInterview(): InterviewEngineState {
    if (this.isCompleted) {
      throw new InterviewAlreadyCompletedError(this.sessionId);
    }

    if (this.stage === 'CREATED') {
      this.transition('WAITING');
    }

    this.transition('INTRO');
    this.status = 'IN_PROGRESS';
    this.startedAtTimestamp = Date.now();

    // Select initial INTRO question
    this.nextQuestion();
    return this.getState();
  }

  public nextQuestion(): EngineQuestion | null {
    if (this.isCompleted) {
      throw new InterviewAlreadyCompletedError(this.sessionId);
    }

    if (this.askedQuestionIds.size >= this.config.maxQuestions) {
      this.completeInterview();
      return null;
    }

    const availableQuestions = getQuestionsForType(this.config.type);
    const unasked = availableQuestions.filter((q) => !this.askedQuestionIds.has(q.id));

    if (unasked.length === 0) {
      this.completeInterview();
      return null;
    }

    // Prefer questions matching current stage
    let selected = unasked.find((q) => q.stage === this.stage);

    if (!selected) {
      // Advance to next stage in STAGE_ORDER
      const currentIdx = STAGE_ORDER.indexOf(this.stage);
      for (let i = currentIdx + 1; i < STAGE_ORDER.length; i++) {
        const nextStage = STAGE_ORDER[i];
        if (this.config.stages.includes(nextStage)) {
          selected = unasked.find((q) => q.stage === nextStage);
          if (selected) {
            this.transition(nextStage);
            break;
          }
        }
      }
    }

    if (!selected) {
      selected = unasked[0];
      if (selected.stage !== this.stage && ALLOWED_TRANSITIONS[this.stage].includes(selected.stage)) {
        this.transition(selected.stage);
      }
    }

    this.currentQuestion = selected;
    this.currentQuestionState = 'ASKING';
    this.askedQuestionIds.add(selected.id);

    return selected;
  }

  public submitAnswer(questionId: string, _answerText: string): InterviewEngineState {
    if (this.isCompleted) {
      throw new InterviewAlreadyCompletedError(this.sessionId);
    }

    if (this.currentQuestion && this.currentQuestion.id === questionId) {
      this.currentQuestionState = 'COMPLETED';
      this.coveredTopics.add(this.currentQuestion.topic);
    }

    // Check completion conditions
    if (this.askedQuestionIds.size >= this.config.maxQuestions || this.stage === 'CLOSING') {
      this.completeInterview();
    }

    return this.getState();
  }

  public transition(targetStage: InterviewStage): void {
    if (this.stage === targetStage) {
      return; // Idempotent same-stage transition
    }

    const allowed = ALLOWED_TRANSITIONS[this.stage];
    if (!allowed || !allowed.includes(targetStage)) {
      throw new InvalidTransitionError(this.stage, targetStage);
    }

    this.stage = targetStage;
    if (targetStage === 'COMPLETED') {
      this.status = 'COMPLETED';
      this.isCompleted = true;
    } else if (targetStage === 'CANCELLED') {
      this.status = 'CANCELLED';
      this.isCompleted = true;
    }
  }

  public completeInterview(): InterviewEngineState {
    if (this.isCompleted) {
      return this.getState();
    }

    if (this.stage !== 'CLOSING' && this.stage !== 'COMPLETING' && this.stage !== 'COMPLETED') {
      if (ALLOWED_TRANSITIONS[this.stage].includes('CLOSING')) {
        this.transition('CLOSING');
      }
    }

    if (ALLOWED_TRANSITIONS[this.stage].includes('COMPLETING')) {
      this.transition('COMPLETING');
    }

    if (ALLOWED_TRANSITIONS[this.stage].includes('COMPLETED')) {
      this.transition('COMPLETED');
    } else {
      this.stage = 'COMPLETED';
      this.status = 'COMPLETED';
      this.isCompleted = true;
    }

    return this.getState();
  }

  public getState(): InterviewEngineState {
    const elapsedSeconds = this.startedAtTimestamp ? Math.floor((Date.now() - this.startedAtTimestamp) / 1000) : 0;
    const totalDurationSeconds = this.config.durationMinutes * 60;
    const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);

    const allTopics = this.config.topics;
    const coveredList = Array.from(this.coveredTopics);
    const remainingTopics = allTopics.filter((t) => !this.coveredTopics.has(t));

    return {
      sessionId: this.sessionId,
      status: this.status,
      stage: this.stage,
      currentQuestionIndex: Math.max(0, this.askedQuestionIds.size - 1),
      currentQuestion: this.currentQuestion,
      currentQuestionState: this.currentQuestionState,
      coveredTopics: coveredList,
      remainingTopics,
      askedQuestionIds: Array.from(this.askedQuestionIds),
      startedAt: this.startedAtTimestamp ? new Date(this.startedAtTimestamp).toISOString() : undefined,
      elapsedSeconds,
      remainingSeconds,
      questionsAsked: this.askedQuestionIds.size,
      questionsRemaining: Math.max(0, this.config.maxQuestions - this.askedQuestionIds.size),
      isCompleted: this.isCompleted,
    };
  }
}
