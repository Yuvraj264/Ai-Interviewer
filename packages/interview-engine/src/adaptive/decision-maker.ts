import { AnswerAnalysis, AdaptiveDecision, QualityCategory } from '@ai-interviewer/shared';

export const ADAPTIVE_DECISION_VERSION = 'ADAPTIVE_DECISION_V1' as const;

export class AdaptiveDecisionMaker {
  private version = ADAPTIVE_DECISION_VERSION;

  public getVersion(): string {
    return this.version;
  }

  public decideNextAction(
    analysis: AnswerAnalysis,
    currentDifficulty: 'easy' | 'medium' | 'hard' = 'medium',
    recentSignalHistory: QualityCategory[] = []
  ): AdaptiveDecision {
    const history = [...recentSignalHistory, analysis.qualityCategory];

    // Difficulty Adjustment Window: Requires 2 consecutive STRONG/WEAK signals
    const lastTwo = history.slice(-2);

    if (lastTwo.length >= 2 && lastTwo.every((sig) => sig === 'STRONG')) {
      if (currentDifficulty === 'easy') {
        return {
          action: 'INCREASE_DIFFICULTY',
          difficulty: 'medium',
          rationale: 'Candidate demonstrated 2 consecutive strong technical answers. Elevating difficulty to medium.',
          confidence: 0.9,
          basedOnQuestionId: analysis.questionId,
        };
      }
      if (currentDifficulty === 'medium') {
        return {
          action: 'INCREASE_DIFFICULTY',
          difficulty: 'hard',
          rationale: 'Candidate demonstrated 2 consecutive strong technical answers. Elevating difficulty to hard.',
          confidence: 0.9,
          basedOnQuestionId: analysis.questionId,
        };
      }
    }

    if (lastTwo.length >= 2 && lastTwo.every((sig) => sig === 'WEAK')) {
      if (currentDifficulty === 'hard') {
        return {
          action: 'DECREASE_DIFFICULTY',
          difficulty: 'medium',
          rationale: 'Candidate struggled on 2 consecutive answers. Adjusting difficulty down to medium.',
          confidence: 0.85,
          basedOnQuestionId: analysis.questionId,
        };
      }
      if (currentDifficulty === 'medium') {
        return {
          action: 'DECREASE_DIFFICULTY',
          difficulty: 'easy',
          rationale: 'Candidate struggled on 2 consecutive answers. Adjusting difficulty down to easy.',
          confidence: 0.85,
          basedOnQuestionId: analysis.questionId,
        };
      }
    }

    // Incomplete or ambiguous answer -> Follow up or Clarify
    if (analysis.qualityCategory === 'UNCLEAR') {
      return {
        action: 'CLARIFY',
        rationale: 'Candidate answer transcript was unclear or ambiguous. Seeking clarification.',
        confidence: 0.8,
        basedOnQuestionId: analysis.questionId,
      };
    }

    if (analysis.missingConcepts.length > 0) {
      const targetTopic = analysis.missingConcepts[0];
      return {
        action: 'FOLLOW_UP',
        targetTopic,
        rationale: `Candidate discussed main concept but omitted ${targetTopic}. Requesting targeted follow-up.`,
        confidence: 0.88,
        basedOnQuestionId: analysis.questionId,
      };
    }

    if (analysis.qualityCategory === 'ADEQUATE') {
      return {
        action: 'PROBE',
        rationale: 'Candidate gave adequate high-level response. Probing for technical depth.',
        confidence: 0.85,
        basedOnQuestionId: analysis.questionId,
      };
    }

    // Default: Advance to new topic or next question
    return {
      action: 'NEW_TOPIC',
      rationale: 'Current topic sufficiently covered with strong evidence. Transitioning to new topic.',
      confidence: 0.95,
      basedOnQuestionId: analysis.questionId,
    };
  }
}
