import { CandidateProfile, JobProfile, CandidateJobProfile, InterviewTarget } from '@ai-interviewer/shared';

export interface BoundedInterviewContext {
  candidateSummary: string;
  jobRole: string;
  activeTarget?: InterviewTarget;
  relevantProjectSnippet?: string;
  relevantSkillSnippet?: string;
  contextBudgetChars: number;
}

export class InterviewContextBuilder {
  public buildTurnContext(
    candidate: CandidateProfile,
    job: JobProfile,
    match: CandidateJobProfile,
    currentTopic?: string
  ): BoundedInterviewContext {
    // Pick highest priority target matching current topic or first high-priority target
    const activeTarget =
      match.interviewTargets.find((t) => currentTopic && t.topic.toLowerCase().includes(currentTopic.toLowerCase())) ||
      match.interviewTargets.find((t) => t.priority === 'HIGH') ||
      match.interviewTargets[0];

    const relevantProj = candidate.projects.find(
      (p) => activeTarget && p.technologies.some((tech) => tech.toLowerCase().includes(activeTarget.topic.toLowerCase()))
    ) || candidate.projects[0];

    const relevantSkill = candidate.skills.find(
      (s) => activeTarget && s.canonicalName.toLowerCase().includes(activeTarget.topic.toLowerCase())
    );

    const candidateSummary = `${candidate.name || 'Candidate'} (${candidate.headline || 'Engineer'}) - Claims: ${candidate.skills.map((s) => s.canonicalName).join(', ')}`;
    const jobRole = `${job.title} at ${job.company || 'Enterprise'} (Required: ${job.requiredSkills.map((s) => s.skill).join(', ')})`;

    const projSnippet = relevantProj
      ? `Project: ${relevantProj.name} (${relevantProj.technologies.join(', ')}) - ${relevantProj.description}`
      : undefined;

    const skillSnippet = relevantSkill
      ? `Skill Claim: ${relevantSkill.canonicalName} (${relevantSkill.verificationStatus}) - Evidence: "${relevantSkill.evidence}"`
      : undefined;

    const totalChars =
      candidateSummary.length +
      jobRole.length +
      (activeTarget?.reason.length || 0) +
      (projSnippet?.length || 0) +
      (skillSnippet?.length || 0);

    return {
      candidateSummary,
      jobRole,
      activeTarget,
      relevantProjectSnippet: projSnippet,
      relevantSkillSnippet: skillSnippet,
      contextBudgetChars: totalChars,
    };
  }
}
