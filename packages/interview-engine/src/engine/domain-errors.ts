export class InvalidTransitionError extends Error {
  constructor(public readonly currentStage: string, public readonly targetStage: string, reason?: string) {
    super(`Invalid stage transition from '${currentStage}' to '${targetStage}'${reason ? `: ${reason}` : ''}`);
    this.name = 'InvalidTransitionError';
  }
}

export class QuestionBudgetExceededError extends Error {
  constructor(public readonly maxQuestions: number) {
    super(`Cannot ask new question: maximum question limit of ${maxQuestions} has been reached.`);
    this.name = 'QuestionBudgetExceededError';
  }
}

export class InterviewAlreadyCompletedError extends Error {
  constructor(public readonly sessionId: string) {
    super(`Interview session '${sessionId}' is already completed and cannot process new events.`);
    this.name = 'InterviewAlreadyCompletedError';
  }
}

export class SessionNotFoundError extends Error {
  constructor(public readonly sessionId: string) {
    super(`Interview session '${sessionId}' was not found.`);
    this.name = 'SessionNotFoundError';
  }
}
