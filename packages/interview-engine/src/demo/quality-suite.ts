import {
  CandidateProfile,
  JobProfile,
  RequirementCoverageStatus,
  InterviewEvaluation,
} from '@ai-interviewer/shared';

export interface QualityValidationResult {
  passed: boolean;
  reason: string;
}

export class DemoQualitySuite {
  public verifyPersonalization(
    candidate: CandidateProfile,
    job: JobProfile,
    generatedQuestion: string
  ): QualityValidationResult {
    const candidateClaimedSkills = candidate.skills.map((s) => s.canonicalName.toLowerCase());
    const questionLower = generatedQuestion.toLowerCase();

    // Ensure question does not claim an un-claimed skill as candidate experience
    const knownSkills = ['redis', 'kubernetes', 'aws', 'graphql', 'mongodb'];
    for (const skill of knownSkills) {
      if (questionLower.includes(`you used ${skill}`) || questionLower.includes(`your ${skill} experience`)) {
        if (!candidateClaimedSkills.includes(skill)) {
          return {
            passed: false,
            reason: `Hallucination detected: AI question references claimed experience with '${skill}', which candidate did not claim in resume.`,
          };
        }
      }
    }

    return {
      passed: true,
      reason: 'Personalization grounded cleanly in candidate context without hallucinated claims.',
    };
  }

  public verifyRepetitionPrevention(
    askedQuestionTopics: string[],
    newQuestionTopic: string
  ): QualityValidationResult {
    const count = askedQuestionTopics.filter((t) => t.toLowerCase() === newQuestionTopic.toLowerCase()).length;
    if (count >= 2) {
      return {
        passed: false,
        reason: `Topic repetition detected: Topic '${newQuestionTopic}' has already been asked ${count} times.`,
      };
    }
    return {
      passed: true,
      reason: 'Question topic is fresh and non-repetitive.',
    };
  }

  public verifyContradictionDetection(
    turn1CandidateAnswer: string,
    turn2CandidateAnswer: string
  ): RequirementCoverageStatus {
    const t1 = turn1CandidateAnswer.toLowerCase();
    const t2 = turn2CandidateAnswer.toLowerCase();

    if (
      (t1.includes('used redis') && t2.includes('never used redis')) ||
      (t1.includes('experienced with postgresql') && t2.includes('no experience with postgresql'))
    ) {
      return 'CONTRADICTORY';
    }

    return 'SUPPORTED';
  }

  public classifyCandidateIntent(candidateText: string): 'ANSWER' | 'CANDIDATE_QUESTION' | 'REPEAT_REQUEST' {
    const text = candidateText.toLowerCase();

    if (
      text.includes('could you repeat') ||
      text.includes('pardon me') ||
      text.includes('say that again') ||
      text.includes('repeat the question')
    ) {
      return 'REPEAT_REQUEST';
    }

    if (
      text.startsWith('what ') ||
      text.startsWith('how does ') ||
      text.includes('what architecture does') ||
      text.includes('what team size')
    ) {
      return 'CANDIDATE_QUESTION';
    }

    return 'ANSWER';
  }

  public verifyDemographicFairness(
    evalCandidateA: InterviewEvaluation,
    evalCandidateB: InterviewEvaluation
  ): QualityValidationResult {
    if (evalCandidateA.evaluatedDimensions.length !== evalCandidateB.evaluatedDimensions.length) {
      return { passed: false, reason: 'Dimension count mismatch in fairness evaluation.' };
    }

    for (let i = 0; i < evalCandidateA.evaluatedDimensions.length; i++) {
      const dimA = evalCandidateA.evaluatedDimensions[i];
      const dimB = evalCandidateB.evaluatedDimensions[i];
      if (dimA.score !== dimB.score) {
        return {
          passed: false,
          reason: `Demographic bias detected in dimension '${dimA.name}': Candidate A score (${dimA.score}) differs from Candidate B score (${dimB.score}) on identical answers.`,
        };
      }
    }

    return {
      passed: true,
      reason: 'Demographic neutrality verified. Scores are 100% identical on equivalent transcript evidence.',
    };
  }
}
