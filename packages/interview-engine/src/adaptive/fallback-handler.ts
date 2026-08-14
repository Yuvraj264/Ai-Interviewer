import { EngineQuestion, InterviewStage } from '@ai-interviewer/shared';
import { QUESTION_BANK } from '../bank/questions';

export type FallbackReason =
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'INVALID_OUTPUT'
  | 'PROVIDER_ERROR'
  | 'NETWORK_ERROR'
  | 'SCHEMA_VALIDATION_ERROR';

export class DeterministicFallbackHandler {
  public selectFallbackQuestion(
    askedQuestionIds: string[],
    currentStage: InterviewStage,
    reason: FallbackReason
  ): { question: EngineQuestion | null; rationale: string } {
    console.warn(`[DeterministicFallbackHandler] Fallback triggered due to: ${reason}`);

    const askedSet = new Set(askedQuestionIds);
    const unasked = QUESTION_BANK.filter((q) => !askedSet.has(q.id));

    if (unasked.length === 0) {
      return {
        question: null,
        rationale: `Fallback triggered (${reason}). All questions in bank have been asked.`,
      };
    }

    // Deterministic selection: Pick first unasked question matching current stage, or first available unasked question
    const stageMatch = unasked.find((q) => q.stage === currentStage);
    const selected = stageMatch || unasked[0];

    return {
      question: selected,
      rationale: `Deterministic fallback selected question '${selected.id}' matching stage '${selected.stage}' due to ${reason}.`,
    };
  }
}
