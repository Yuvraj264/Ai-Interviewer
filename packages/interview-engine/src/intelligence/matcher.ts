import { CandidateProfile, JobProfile, CandidateJobProfile, InterviewTarget } from '@ai-interviewer/shared';

export class CandidateJobMatcher {
  public matchCandidateToJob(candidate: CandidateProfile, job: JobProfile): CandidateJobProfile {
    const candidateSkillsMap = new Map(candidate.skills.map((s) => [s.canonicalName.toLowerCase(), s]));

    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    const unverifiedSkills: string[] = [];
    const targets: InterviewTarget[] = [];

    // Evaluate required skills
    job.requiredSkills.forEach((req, idx) => {
      const skillName = req.skill;
      const key = skillName.toLowerCase();
      const candSkill = candidateSkillsMap.get(key);

      if (candSkill) {
        matchedSkills.push(skillName);
        if (candSkill.verificationStatus === 'UNVERIFIED') {
          unverifiedSkills.push(skillName);
          targets.push({
            id: `target_verify_${idx}_${Date.now()}`,
            type: 'VERIFY_RESUME_CLAIM',
            topic: skillName,
            reason: `Candidate claims ${skillName} on resume. Verification required for target job role.`,
            priority: req.importance === 'CORE' ? 'HIGH' : 'MEDIUM',
            verificationGoal: `Evaluate practical engineering proficiency in ${skillName}.`,
            status: 'PENDING',
          });
        }
      } else {
        missingSkills.push(skillName);
        targets.push({
          id: `target_gap_${idx}_${Date.now()}`,
          type: 'EXPLORE_GAP',
          topic: skillName,
          reason: `Job requires ${skillName} but candidate resume does not explicitly list it.`,
          priority: req.importance === 'CORE' ? 'HIGH' : 'LOW',
          verificationGoal: `Assess adjacent experience or underlying knowledge of ${skillName}.`,
          status: 'PENDING',
        });
      }
    });

    // Evaluate project deep-dive targets
    candidate.projects.forEach((proj, idx) => {
      targets.push({
        id: `target_proj_${idx}_${Date.now()}`,
        type: 'DEEP_DIVE_PROJECT',
        topic: proj.name,
        reason: `Candidate resume highlights project '${proj.name}' (${proj.technologies.join(', ')}).`,
        priority: 'HIGH',
        verificationGoal: `Investigate architectural decisions, tradeoffs, and candidate contribution in ${proj.name}.`,
        status: 'PENDING',
      });
    });

    return {
      candidateId: candidate.candidateId,
      jobId: job.jobId,
      matchedSkills,
      missingSkills,
      unverifiedSkills,
      relevantProjects: candidate.projects,
      interviewTargets: targets,
    };
  }
}
