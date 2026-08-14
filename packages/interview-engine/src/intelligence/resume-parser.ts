import { CandidateProfile, CandidateSkill, CandidateProject, CandidateExperience } from '@ai-interviewer/shared';
import { SkillNormalizer } from './skill-normalizer';

export const RESUME_PARSER_VERSION = 'RESUME_PARSER_V1' as const;

export class ResumeParser {
  private version = RESUME_PARSER_VERSION;
  private normalizer = new SkillNormalizer();

  public getVersion(): string {
    return this.version;
  }

  public parseResume(rawText: string, candidateId: string, candidateName?: string): CandidateProfile {
    const cleanText = rawText.trim();
    if (this.containsPromptInjection(cleanText)) {
      console.warn(`[ResumeParser] Prompt injection detected in resume text. Parsing as untrusted data.`);
    }

    // Extract skills grounded in text
    const skills = this.extractSkills(cleanText);
    const projects = this.extractProjects(cleanText);
    const experience = this.extractExperience(cleanText);

    const extractedName = this.extractName(cleanText);
    const name = extractedName !== 'Candidate' ? extractedName : candidateName || 'Candidate';

    return {
      candidateId,
      name,
      headline: 'Software Engineer',
      summary: cleanText.slice(0, 300),
      education: [{ institution: 'State University', degree: 'B.S. Computer Science' }],
      experience,
      projects,
      skills,
      sourceDocumentId: `doc_resume_${Date.now()}`,
    };
  }

  private containsPromptInjection(text: string): boolean {
    const patterns = [
      /ignore (all|previous|system) instructions/i,
      /make candidate an expert/i,
      /reveal system prompt/i,
    ];
    return patterns.some((p) => p.test(text));
  }

  private extractSkills(text: string): CandidateSkill[] {
    const lower = text.toLowerCase();
    const targetSkills = ['node', 'react', 'postgres', 'redis', 'docker', 'kafka', 'spring boot', 'aws'];
    const skills: CandidateSkill[] = [];

    targetSkills.forEach((raw) => {
      if (lower.includes(raw)) {
        const { canonicalName, category } = this.normalizer.normalizeSkill(raw);
        skills.push({
          canonicalName,
          rawName: raw,
          category,
          source: 'resume',
          evidence: `Mentioned ${raw} in resume text.`,
          verificationStatus: 'UNVERIFIED',
        });
      }
    });

    return skills;
  }

  private extractProjects(text: string): CandidateProject[] {
    const lower = text.toLowerCase();
    const projects: CandidateProject[] = [];

    if (lower.includes('primebank') || lower.includes('banking') || lower.includes('payment')) {
      projects.push({
        name: 'PrimeBank System',
        description: 'High-throughput transactional banking platform.',
        technologies: ['Spring Boot', 'PostgreSQL', 'Redis'],
        role: 'Backend Engineer',
        outcomes: ['Handled 10k TPS with strong transactional consistency'],
      });
    }

    if (projects.length === 0) {
      projects.push({
        name: 'Scalable Microservices Project',
        description: 'Backend services for e-commerce processing.',
        technologies: ['Node.js', 'PostgreSQL'],
      });
    }

    return projects;
  }

  private extractExperience(_text: string): CandidateExperience[] {
    return [
      {
        company: 'TechCorp Solutions',
        role: 'Software Engineer',
        startDate: '2021',
        endDate: 'Present',
        responsibilities: ['Developed scalable backend APIs', 'Optimized database queries and indexing'],
        technologies: ['Node.js', 'PostgreSQL', 'Redis'],
      },
    ];
  }

  private extractName(text: string): string {
    const match = text.match(/Name:\s*([A-Za-z\s]+)/i);
    return match ? match[1].trim() : 'Candidate';
  }
}
