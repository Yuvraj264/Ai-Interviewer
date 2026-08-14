import { JobProfile, SkillRequirement } from '@ai-interviewer/shared';
import { SkillNormalizer } from './skill-normalizer';

export const JD_PARSER_VERSION = 'JD_PARSER_V1' as const;

export class JobDescriptionParser {
  private version = JD_PARSER_VERSION;
  private normalizer = new SkillNormalizer();

  public getVersion(): string {
    return this.version;
  }

  public parseJobDescription(rawText: string, jobId: string, targetRole?: string): JobProfile {
    const cleanText = rawText.trim();
    const { required, preferred } = this.extractSkillRequirements(cleanText);

    const extractedTitle = this.extractTitle(cleanText);
    const title = extractedTitle !== 'Software Engineer' ? extractedTitle : targetRole || 'Software Engineer';

    return {
      jobId,
      title,
      company: 'Enterprise Inc',
      seniority: 'Senior',
      summary: cleanText.slice(0, 300),
      requiredSkills: required,
      preferredSkills: preferred,
      responsibilities: [
        'Build high-performance REST APIs',
        'Maintain database schemas and query performance',
        'Collaborate on microservices architecture',
      ],
      qualifications: ['Bachelor degree in Computer Science or equivalent', '3+ years software engineering experience'],
      domains: ['fintech', 'distributed-systems'],
    };
  }

  private extractSkillRequirements(text: string): { required: SkillRequirement[]; preferred: SkillRequirement[] } {
    const lower = text.toLowerCase();
    const required: SkillRequirement[] = [];
    const preferred: SkillRequirement[] = [];

    const known = ['node', 'postgres', 'redis', 'react', 'docker', 'kafka', 'aws'];

    known.forEach((skillRaw) => {
      if (lower.includes(skillRaw)) {
        const { canonicalName } = this.normalizer.normalizeSkill(skillRaw);
        // If explicitly mentioned under preferred/bonus section
        if (lower.includes(`preferred: ${skillRaw}`) || lower.includes(`bonus: ${skillRaw}`)) {
          preferred.push({
            skill: canonicalName,
            importance: 'IMPORTANT',
            isRequired: false,
            evidence: `Listed as preferred requirement in JD text.`,
          });
        } else {
          required.push({
            skill: canonicalName,
            importance: 'CORE',
            isRequired: true,
            evidence: `Listed as required core requirement in JD text.`,
          });
        }
      }
    });

    if (required.length === 0) {
      required.push({ skill: 'Node.js', importance: 'CORE', isRequired: true });
      required.push({ skill: 'PostgreSQL', importance: 'CORE', isRequired: true });
    }

    return { required, preferred };
  }

  private extractTitle(text: string): string {
    const match = text.match(/Role:\s*([A-Za-z\s]+)/i);
    return match ? match[1].trim() : 'Software Engineer';
  }
}
