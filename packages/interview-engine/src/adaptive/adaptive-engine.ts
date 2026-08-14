import {
  EngineQuestion,
  InterviewStage,
  AnswerAnalysis,
  AdaptiveDecision,
  AdaptiveDecisionRecord,
  QualityCategory,
} from '@ai-interviewer/shared';
import { AnswerAnalyzer } from './analyzer';
import { AdaptiveDecisionMaker } from './decision-maker';
import { AdaptiveQuestionSelector } from './question-selector';
import { DeterministicFallbackHandler, FallbackReason } from './fallback-handler';

export interface AdaptiveEngineResult {
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

export class AdaptiveQuestioningEngine {
  private analyzer: AnswerAnalyzer;
  private decisionMaker: AdaptiveDecisionMaker;
  private selector: AdaptiveQuestionSelector;
  private fallbackHandler: DeterministicFallbackHandler;

  constructor() {
    this.analyzer = new AnswerAnalyzer();
    this.decisionMaker = new AdaptiveDecisionMaker();
    this.selector = new AdaptiveQuestionSelector();
    this.fallbackHandler = new DeterministicFallbackHandler();
  }

  public async processCandidateAnswer(
    sessionId: string,
    currentQuestionId: string,
    questionPrompt: string,
    candidateTranscript: string,
    askedQuestionIds: string[],
    currentStage: InterviewStage,
    currentDifficulty: 'easy' | 'medium' | 'hard' = 'medium',
    recentSignalHistory: QualityCategory[] = []
  ): Promise<AdaptiveEngineResult> {
    const startTime = Date.now();

    try {
      // 1. Answer Analysis
      const analysisStart = Date.now();
      const analysis = await this.analyzer.analyzeAnswer(currentQuestionId, questionPrompt, candidateTranscript);
      const analysisLatencyMs = Date.now() - analysisStart;

      // 2. Adaptive Decision
      const decisionStart = Date.now();
      const decision = this.decisionMaker.decideNextAction(analysis, currentDifficulty, recentSignalHistory);
      const decisionLatencyMs = Date.now() - decisionStart;

      // 3. Question Selection
      const nextQuestion = this.selector.selectNextQuestion(
        decision,
        askedQuestionIds,
        currentStage,
        decision.difficulty || currentDifficulty
      );

      const totalAdaptiveLatencyMs = Date.now() - startTime;

      const record: AdaptiveDecisionRecord = {
        sessionId,
        previousQuestionId: currentQuestionId,
        analysis,
        decision,
        selectedQuestionId: nextQuestion?.id || 'none',
        validationResult: 'ACCEPTED',
        timestamp: new Date().toISOString(),
      };

      return {
        analysis,
        decision,
        nextQuestion,
        record,
        latencyMs: {
          analysisLatencyMs,
          decisionLatencyMs,
          totalAdaptiveLatencyMs,
        },
      };
    } catch (error) {
      console.error(`[AdaptiveQuestioningEngine] Adaptive processing failed. Falling back to deterministic selector. Error:`, error);
      return this.executeFallback(sessionId, currentQuestionId, askedQuestionIds, currentStage, 'PROVIDER_ERROR', startTime);
    }
  }

  public executeFallback(
    sessionId: string,
    currentQuestionId: string,
    askedQuestionIds: string[],
    currentStage: InterviewStage,
    reason: FallbackReason,
    startTime = Date.now()
  ): AdaptiveEngineResult {
    const { question, rationale } = this.fallbackHandler.selectFallbackQuestion(askedQuestionIds, currentStage, reason);

    const fallbackAnalysis: AnswerAnalysis = {
      answerId: `ans_fallback_${Date.now()}`,
      questionId: currentQuestionId,
      transcript: '',
      completeness: 'LOW',
      relevance: 'LOW',
      depth: 'LOW',
      qualityCategory: 'UNCLEAR',
      conceptsDetected: [],
      skillsDemonstrated: [],
      missingConcepts: [],
      evidence: [],
    };

    const fallbackDecision: AdaptiveDecision = {
      action: 'NEW_TOPIC',
      rationale,
      confidence: 1.0,
      basedOnQuestionId: currentQuestionId,
    };

    const totalAdaptiveLatencyMs = Date.now() - startTime;

    const record: AdaptiveDecisionRecord = {
      sessionId,
      previousQuestionId: currentQuestionId,
      analysis: fallbackAnalysis,
      decision: fallbackDecision,
      selectedQuestionId: question?.id || 'none',
      validationResult: 'FALLBACK_USED',
      timestamp: new Date().toISOString(),
    };

    return {
      analysis: fallbackAnalysis,
      decision: fallbackDecision,
      nextQuestion: question,
      record,
      latencyMs: {
        analysisLatencyMs: 0,
        decisionLatencyMs: 0,
        totalAdaptiveLatencyMs,
      },
    };
  }
}
