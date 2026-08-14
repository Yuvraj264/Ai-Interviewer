interface InterviewerPromptContext {
    candidateName?: string;
    role?: string;
    interviewType?: string;
}
declare function buildInterviewerInstructions(context?: InterviewerPromptContext): string;

interface InterviewInteractionProvider {
    start(): Promise<void>;
    submitCandidateResponse(response: string): Promise<void>;
    getCurrentStep(): {
        questionIndex: number;
        totalQuestions: number;
        question: string;
        suggestedAnswers?: string[];
    } | null;
    onStateChange(callback: (state: MockInterviewerState) => void): void;
    end(): Promise<void>;
}
interface MockInterviewerState {
    currentQuestionIndex: number;
    totalQuestions: number;
    currentQuestion: string;
    isCompleted: boolean;
    progressPercentage: number;
}
declare class MockInterviewer implements InterviewInteractionProvider {
    private type;
    private questions;
    private currentIndex;
    private isCompleted;
    private listeners;
    constructor(type?: 'technical' | 'behavioral' | 'mixed');
    start(): Promise<void>;
    submitCandidateResponse(_response: string): Promise<void>;
    getCurrentStep(): {
        questionIndex: number;
        totalQuestions: number;
        question: string;
        suggestedAnswers: string[];
    } | null;
    getState(): MockInterviewerState;
    onStateChange(callback: (state: MockInterviewerState) => void): void;
    end(): Promise<void>;
    private notifyState;
}

export { type InterviewInteractionProvider, type InterviewerPromptContext, MockInterviewer, type MockInterviewerState, buildInterviewerInstructions };
