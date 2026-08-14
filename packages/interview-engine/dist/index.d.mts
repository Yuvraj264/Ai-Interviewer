import { EngineQuestion, InterviewType, InterviewConfig, InterviewEngineState, InterviewStage, AnswerAnalysis, QualityCategory, AdaptiveDecision, AdaptiveDecisionRecord } from '@ai-interviewer/shared';

interface InterviewerPromptContext {
    candidateName?: string;
    role?: string;
    interviewType?: string;
}
declare function buildInterviewerInstructions(context?: InterviewerPromptContext): string;

declare const QUESTION_BANK: EngineQuestion[];
declare function getQuestionsForType(type: InterviewType): EngineQuestion[];

declare class InvalidTransitionError extends Error {
    readonly currentStage: string;
    readonly targetStage: string;
    constructor(currentStage: string, targetStage: string, reason?: string);
}
declare class QuestionBudgetExceededError extends Error {
    readonly maxQuestions: number;
    constructor(maxQuestions: number);
}
declare class InterviewAlreadyCompletedError extends Error {
    readonly sessionId: string;
    constructor(sessionId: string);
}
declare class SessionNotFoundError extends Error {
    readonly sessionId: string;
    constructor(sessionId: string);
}

declare class InterviewEngine {
    readonly sessionId: string;
    private config;
    private status;
    private stage;
    private currentQuestion?;
    private currentQuestionState?;
    private coveredTopics;
    private askedQuestionIds;
    private startedAtTimestamp?;
    private isCompleted;
    constructor(sessionId: string, config?: Partial<InterviewConfig>);
    startInterview(): InterviewEngineState;
    nextQuestion(): EngineQuestion | null;
    submitAnswer(questionId: string, _answerText: string): InterviewEngineState;
    transition(targetStage: InterviewStage): void;
    completeInterview(): InterviewEngineState;
    getState(): InterviewEngineState;
}

declare const ANSWER_ANALYSIS_VERSION: "ANSWER_ANALYSIS_V1";
interface AnalyzerOptions {
    apiKey?: string;
    timeoutMs?: number;
}
declare class AnswerAnalyzer {
    private options;
    private version;
    constructor(options?: AnalyzerOptions);
    getVersion(): string;
    analyzeAnswer(questionId: string, questionPrompt: string, rawTranscript: string): Promise<AnswerAnalysis>;
    private sanitizeTranscript;
    private containsPromptInjection;
    private extractGroundedConcepts;
    private classifyQuality;
    private identifyMissingConcepts;
}

declare const ADAPTIVE_DECISION_VERSION: "ADAPTIVE_DECISION_V1";
declare class AdaptiveDecisionMaker {
    private version;
    getVersion(): string;
    decideNextAction(analysis: AnswerAnalysis, currentDifficulty?: 'easy' | 'medium' | 'hard', recentSignalHistory?: QualityCategory[]): AdaptiveDecision;
}

interface QuestionSelectorOptions {
    maxFollowUpsPerQuestion?: number;
}
declare class AdaptiveQuestionSelector {
    private maxFollowUps;
    constructor(options?: QuestionSelectorOptions);
    selectNextQuestion(decision: AdaptiveDecision, askedQuestionIds: string[], currentStage: InterviewStage, currentDifficulty: 'easy' | 'medium' | 'hard', followUpCountForCurrentQuestion?: number): EngineQuestion | null;
}

type FallbackReason = 'TIMEOUT' | 'RATE_LIMIT' | 'INVALID_OUTPUT' | 'PROVIDER_ERROR' | 'NETWORK_ERROR' | 'SCHEMA_VALIDATION_ERROR';
declare class DeterministicFallbackHandler {
    selectFallbackQuestion(askedQuestionIds: string[], currentStage: InterviewStage, reason: FallbackReason): {
        question: EngineQuestion | null;
        rationale: string;
    };
}

interface AdaptiveEngineResult {
    analysis: AnswerAnalysis;
    decision: AdaptiveDecision;
    nextQuestion: EngineQuestion | null;
    record: AdaptiveDecisionRecord;
    latencyMs: {
        analysisLatencyMs: number;
        decisionLatencyMs: number;
        totalAdaptiveLatencyMs: number;
    };
}
declare class AdaptiveQuestioningEngine {
    private analyzer;
    private decisionMaker;
    private selector;
    private fallbackHandler;
    constructor();
    processCandidateAnswer(sessionId: string, currentQuestionId: string, questionPrompt: string, candidateTranscript: string, askedQuestionIds: string[], currentStage: InterviewStage, currentDifficulty?: 'easy' | 'medium' | 'hard', recentSignalHistory?: QualityCategory[]): Promise<AdaptiveEngineResult>;
    executeFallback(sessionId: string, currentQuestionId: string, askedQuestionIds: string[], currentStage: InterviewStage, reason: FallbackReason, startTime?: number): AdaptiveEngineResult;
}

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

export { ADAPTIVE_DECISION_VERSION, ANSWER_ANALYSIS_VERSION, AdaptiveDecisionMaker, type AdaptiveEngineResult, AdaptiveQuestionSelector, AdaptiveQuestioningEngine, type AnalyzerOptions, AnswerAnalyzer, DeterministicFallbackHandler, type FallbackReason, InterviewAlreadyCompletedError, InterviewEngine, type InterviewInteractionProvider, type InterviewerPromptContext, InvalidTransitionError, MockInterviewer, type MockInterviewerState, QUESTION_BANK, QuestionBudgetExceededError, type QuestionSelectorOptions, SessionNotFoundError, buildInterviewerInstructions, getQuestionsForType };
