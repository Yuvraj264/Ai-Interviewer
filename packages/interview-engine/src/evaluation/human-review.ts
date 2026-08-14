import {
  InterviewEvaluation,
  HumanReview,
  HumanReviewOverride,
} from '@ai-interviewer/shared';

export class HumanReviewService {
  private reviews = new Map<string, HumanReview[]>();

  public createReview(payload: {
    evaluationId: string;
    reviewerId: string;
    reviewerName: string;
    humanOverrides: Record<string, HumanReviewOverride>;
    overallDecisionNote?: string;
  }): HumanReview {
    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const review: HumanReview = {
      reviewId,
      evaluationId: payload.evaluationId,
      reviewerId: payload.reviewerId,
      reviewerName: payload.reviewerName,
      humanOverrides: payload.humanOverrides,
      overallDecisionNote: payload.overallDecisionNote,
      timestamp: new Date().toISOString(),
    };

    const existing = this.reviews.get(payload.evaluationId) || [];
    this.reviews.set(payload.evaluationId, [...existing, review]);

    console.log(`[HumanReviewService] Created review ${reviewId} for evaluation ${payload.evaluationId} by ${payload.reviewerName}`);
    return review;
  }

  public getReviewsForEvaluation(evaluationId: string): HumanReview[] {
    return this.reviews.get(evaluationId) || [];
  }

  public applyHumanReview(
    evaluation: InterviewEvaluation,
    review: HumanReview
  ): InterviewEvaluation {
    const updatedDimensions = evaluation.evaluatedDimensions.map((dim) => {
      const override = review.humanOverrides[dim.dimensionId];
      if (override) {
        return {
          ...dim,
          score: override.score,
          limitations: [...dim.limitations, `Human Reviewer Override (${review.reviewerName}): ${override.note}`],
        };
      }
      return dim;
    });

    return {
      ...evaluation,
      evaluatedDimensions: updatedDimensions,
      status: 'COMPLETED',
    };
  }
}
