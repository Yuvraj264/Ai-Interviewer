import { InterviewType } from '@ai-interviewer/shared';

interface QuestionStep {
    id: string;
    question: string;
    category: 'intro' | 'technical' | 'behavioral' | 'completion';
    suggestedAnswers?: string[];
}
interface MockInterviewerState {
    currentQuestionIndex: number;
    totalQuestions: number;
    currentQuestion: string;
    progressPercentage: number;
    isCompleted: boolean;
}
type QuestionChangeCallback = (question: string, questionIndex: number, totalQuestions: number) => void;
type StateChangeCallback = (state: MockInterviewerState) => void;
interface InterviewInteractionProvider {
    start(): Promise<void>;
    submitCandidateResponse(response: string): Promise<void>;
    end(): Promise<void>;
    onQuestionChange(callback: QuestionChangeCallback): void;
    onStateChange(callback: StateChangeCallback): void;
    getState(): MockInterviewerState;
}
declare class MockInterviewer implements InterviewInteractionProvider {
    private questions;
    private currentIndex;
    private isCompleted;
    private questionCallbacks;
    private stateCallbacks;
    constructor(interviewType?: InterviewType);
    start(): Promise<void>;
    submitCandidateResponse(_response: string): Promise<void>;
    end(): Promise<void>;
    onQuestionChange(callback: QuestionChangeCallback): void;
    onStateChange(callback: StateChangeCallback): void;
    getCurrentStep(): QuestionStep;
    getState(): MockInterviewerState;
    private notifyListeners;
}
declare const INTERVIEW_ENGINE_VERSION = "0.2.0-phase2";

export { INTERVIEW_ENGINE_VERSION, type InterviewInteractionProvider, MockInterviewer, type MockInterviewerState, type QuestionChangeCallback, type QuestionStep, type StateChangeCallback };
