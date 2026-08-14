import { InterviewType } from '@ai-interviewer/shared';

export interface QuestionStep {
  id: string;
  question: string;
  category: 'intro' | 'technical' | 'behavioral' | 'completion';
  suggestedAnswers?: string[];
}

export interface MockInterviewerState {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: string;
  progressPercentage: number;
  isCompleted: boolean;
}

export type QuestionChangeCallback = (
  question: string,
  questionIndex: number,
  totalQuestions: number,
) => void;

export type StateChangeCallback = (state: MockInterviewerState) => void;

export interface InterviewInteractionProvider {
  start(): Promise<void>;
  submitCandidateResponse(response: string): Promise<void>;
  end(): Promise<void>;
  onQuestionChange(callback: QuestionChangeCallback): void;
  onStateChange(callback: StateChangeCallback): void;
  getState(): MockInterviewerState;
}

const DEFAULT_QUESTIONS: Record<InterviewType, QuestionStep[]> = {
  technical: [
    {
      id: 'tech_1',
      question: 'Welcome! To start off, please describe your experience with modern TypeScript and distributed architectures.',
      category: 'intro',
      suggestedAnswers: [
        'I have 4+ years of experience building TypeScript microservices with Node.js and REST/gRPC APIs.',
        'I specialize in frontend React and Next.js applications with state management.',
      ],
    },
    {
      id: 'tech_2',
      question: 'Walk me through a challenging technical problem you recently solved. What trade-offs did you evaluate?',
      category: 'technical',
      suggestedAnswers: [
        'We faced high latency in DB queries, so I introduced Redis caching and query indexing.',
        'We decoupled our monodb into microservices, improving deployment speed and fault tolerance.',
      ],
    },
    {
      id: 'tech_3',
      question: 'How do you ensure system scalability, performance, and fault tolerance when building production APIs?',
      category: 'technical',
      suggestedAnswers: [
        'Using horizontal auto-scaling, asynchronous queues, rate limiting, and structured logging.',
        'Enforcing strict API contracts, circuit breakers, and comprehensive automated test suites.',
      ],
    },
    {
      id: 'tech_4',
      question: 'Thank you! That completes our technical assessment. Do you have any final remarks on your implementation strategy?',
      category: 'completion',
      suggestedAnswers: ['I focus on clean, testable, and maintainable architecture.'],
    },
  ],
  behavioral: [
    {
      id: 'beh_1',
      question: 'Welcome! Tell me about a time you had to navigate ambiguity or conflicting priorities on a critical project.',
      category: 'intro',
      suggestedAnswers: [
        'I aligned stakeholders by presenting a phased roadmap and prioritizing high-impact MVP features.',
      ],
    },
    {
      id: 'beh_2',
      question: 'Describe a situation where a project or release failed to meet expectations. What did you learn?',
      category: 'behavioral',
      suggestedAnswers: [
        'We missed a edge-case scenario; I introduced automated integration testing to prevent recurrence.',
      ],
    },
    {
      id: 'beh_3',
      question: 'How do you collaborate with non-technical team members, product managers, and designers?',
      category: 'behavioral',
      suggestedAnswers: [
        'By translating technical constraints into business impact and maintaining open feedback channels.',
      ],
    },
    {
      id: 'beh_4',
      question: 'Thank you! That concludes our behavioral questions. We appreciate your insights.',
      category: 'completion',
      suggestedAnswers: ['Thank you for the thoughtful discussion!'],
    },
  ],
  mixed: [
    {
      id: 'mix_1',
      question: 'Welcome! Please introduce yourself and highlight your core technical and leadership strengths.',
      category: 'intro',
      suggestedAnswers: [
        'I am a Senior Software Engineer passionate about backend architecture and engineering mentorship.',
      ],
    },
    {
      id: 'mix_2',
      question: 'Technical Question: Explain how you design RESTful APIs for consistency, versioning, and client safety.',
      category: 'technical',
      suggestedAnswers: [
        'I use clear URL resources, standard HTTP verbs, semantic status codes, and URI versioning.',
      ],
    },
    {
      id: 'mix_3',
      question: 'Behavioral Question: How do you handle code reviews when you disagree with a peer architectural choice?',
      category: 'behavioral',
      suggestedAnswers: [
        'I focus on objective trade-offs, performance metrics, and team coding guidelines.',
      ],
    },
    {
      id: 'mix_4',
      question: 'Thank you! That concludes our mixed interview session. Your responses have been recorded.',
      category: 'completion',
      suggestedAnswers: ['Thank you!'],
    },
  ],
};

export class MockInterviewer implements InterviewInteractionProvider {
  private questions: QuestionStep[];
  private currentIndex = 0;
  private isCompleted = false;
  private questionCallbacks: QuestionChangeCallback[] = [];
  private stateCallbacks: StateChangeCallback[] = [];

  constructor(interviewType: InterviewType = 'technical') {
    this.questions = DEFAULT_QUESTIONS[interviewType] || DEFAULT_QUESTIONS.technical;
  }

  public async start(): Promise<void> {
    this.currentIndex = 0;
    this.isCompleted = false;
    this.notifyListeners();
  }

  public async submitCandidateResponse(_response: string): Promise<void> {
    if (this.isCompleted) return;

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.notifyListeners();
    } else {
      this.isCompleted = true;
      this.notifyListeners();
    }
  }

  public async end(): Promise<void> {
    this.isCompleted = true;
    this.notifyListeners();
  }

  public onQuestionChange(callback: QuestionChangeCallback): void {
    this.questionCallbacks.push(callback);
  }

  public onStateChange(callback: StateChangeCallback): void {
    this.stateCallbacks.push(callback);
  }

  public getCurrentStep(): QuestionStep {
    return this.questions[this.currentIndex];
  }

  public getState(): MockInterviewerState {
    const total = this.questions.length;
    const currentStepNum = Math.min(this.currentIndex + 1, total);
    const progressPercentage = Math.round((currentStepNum / total) * 100);

    return {
      currentQuestionIndex: this.currentIndex,
      totalQuestions: total,
      currentQuestion: this.questions[this.currentIndex]?.question || '',
      progressPercentage: this.isCompleted ? 100 : progressPercentage,
      isCompleted: this.isCompleted,
    };
  }

  private notifyListeners(): void {
    const state = this.getState();
    this.questionCallbacks.forEach((cb) =>
      cb(state.currentQuestion, state.currentQuestionIndex, state.totalQuestions),
    );
    this.stateCallbacks.forEach((cb) => cb(state));
  }
}

export const INTERVIEW_ENGINE_VERSION = '0.2.0-phase2';
