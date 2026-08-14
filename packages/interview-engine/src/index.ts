export * from './prompts/interviewer';
export * from './bank/questions';
export * from './engine/domain-errors';
export * from './engine/interview-engine';
export * from './adaptive/analyzer';
export * from './adaptive/decision-maker';
export * from './adaptive/question-selector';
export * from './adaptive/fallback-handler';
export * from './adaptive/adaptive-engine';

export interface InterviewInteractionProvider {
  start(): Promise<void>;
  submitCandidateResponse(response: string): Promise<void>;
  getCurrentStep(): { questionIndex: number; totalQuestions: number; question: string; suggestedAnswers?: string[] } | null;
  onStateChange(callback: (state: MockInterviewerState) => void): void;
  end(): Promise<void>;
}

export interface MockInterviewerState {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: string;
  isCompleted: boolean;
  progressPercentage: number;
}

const DETERMINISTIC_QUESTIONS = {
  technical: [
    'Welcome! Could you give a 1-minute overview of your technical background and core skills?',
    'What was the most challenging technical project you built recently, and how did you approach its design?',
    'How do you manage system reliability, performance optimization, and error handling in high-throughput applications?',
  ],
  behavioral: [
    'Welcome! Could you introduce yourself and describe your professional journey?',
    'Tell me about a time when you disagreed with a team decision or technical direction. How did you resolve it?',
    'How do you prioritize competing deadlines and manage high-stress engineering deliveries?',
  ],
  mixed: [
    'Welcome! Could you introduce yourself and highlight your engineering strengths?',
    'What key architectural tradeoffs did you evaluate in a recent major software decision?',
    'Tell me about a time you mentored a team member or handled team conflict under tight deadlines.',
  ],
};

export class MockInterviewer implements InterviewInteractionProvider {
  private type: 'technical' | 'behavioral' | 'mixed';
  private questions: string[];
  private currentIndex = 0;
  private isCompleted = false;
  private listeners: Array<(state: MockInterviewerState) => void> = [];

  constructor(type: 'technical' | 'behavioral' | 'mixed' = 'technical') {
    this.type = type;
    this.questions = DETERMINISTIC_QUESTIONS[type] || DETERMINISTIC_QUESTIONS.technical;
  }

  public async start(): Promise<void> {
    this.currentIndex = 0;
    this.isCompleted = false;
    this.notifyState();
  }

  public async submitCandidateResponse(_response: string): Promise<void> {
    if (this.isCompleted) return;

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex += 1;
    } else {
      this.isCompleted = true;
    }
    this.notifyState();
  }

  public getCurrentStep() {
    if (this.isCompleted) return null;
    return {
      questionIndex: this.currentIndex,
      totalQuestions: this.questions.length,
      question: this.questions[this.currentIndex],
      suggestedAnswers: [
        `Here is a summary of my background in ${this.type} engineering...`,
        `In my recent project, I focused on robust architecture and scalable design...`,
      ],
    };
  }

  public getState(): MockInterviewerState {
    return {
      currentQuestionIndex: this.currentIndex,
      totalQuestions: this.questions.length,
      currentQuestion: this.isCompleted
        ? 'Interview Completed. Thank you!'
        : this.questions[this.currentIndex],
      isCompleted: this.isCompleted,
      progressPercentage: this.isCompleted
        ? 100
        : Math.round((this.currentIndex / this.questions.length) * 100),
    };
  }

  public onStateChange(callback: (state: MockInterviewerState) => void): void {
    this.listeners.push(callback);
  }

  public async end(): Promise<void> {
    this.isCompleted = true;
    this.notifyState();
  }

  private notifyState(): void {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }
}
