import { EngineQuestion, InterviewStage, AdaptiveDecision } from '@ai-interviewer/shared';
import { QUESTION_BANK } from '../bank/questions';

export interface QuestionSelectorOptions {
  maxFollowUpsPerQuestion?: number;
}

export class AdaptiveQuestionSelector {
  private maxFollowUps = 2;

  constructor(options?: QuestionSelectorOptions) {
    if (options?.maxFollowUpsPerQuestion) {
      this.maxFollowUps = options.maxFollowUpsPerQuestion;
    }
  }

  public selectNextQuestion(
    decision: AdaptiveDecision,
    askedQuestionIds: string[],
    currentStage: InterviewStage,
    currentDifficulty: 'easy' | 'medium' | 'hard',
    followUpCountForCurrentQuestion = 0
  ): EngineQuestion | null {
    const askedSet = new Set(askedQuestionIds);
    const available = QUESTION_BANK.filter((q) => !askedSet.has(q.id));

    if (available.length === 0) return null;

    // 1. FILTER: Exclude forbidden stages and unallowed difficulty jumps
    const filtered = available.filter((q) => {
      // Allow current stage or valid stage flow
      const validStages: InterviewStage[] = [currentStage, 'TECHNICAL', 'BEHAVIORAL', 'CLOSING'];
      if (!validStages.includes(q.stage)) return false;

      // Prevent jumping easy -> hard
      if (currentDifficulty === 'easy' && q.difficulty === 'hard') return false;

      return true;
    });

    if (filtered.length === 0) return available[0]; // Emergency unasked fallback

    // Enforce follow-up depth limit
    const enforceFollowUp = decision.action === 'FOLLOW_UP' && followUpCountForCurrentQuestion < this.maxFollowUps;

    // 2. RANKING: Score remaining candidate questions
    const scored = filtered.map((q) => {
      let score = 0;

      // Prefer exact stage match
      if (q.stage === currentStage) score += 30;

      // Prefer target topic match
      if (decision.targetTopic && q.topic.includes(decision.targetTopic)) {
        score += 50;
      }

      // Prefer requested difficulty
      const targetDiff = decision.difficulty || currentDifficulty;
      if (q.difficulty === targetDiff) score += 20;

      // Follow-up boost
      if (enforceFollowUp && q.id.includes(decision.basedOnQuestionId)) score += 40;

      return { question: q, score };
    });

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored[0].question;
  }
}
