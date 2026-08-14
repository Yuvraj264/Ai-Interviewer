import { AnswerAnalysis, QualityCategory } from '@ai-interviewer/shared';

export const ANSWER_ANALYSIS_VERSION = 'ANSWER_ANALYSIS_V1' as const;

export interface AnalyzerOptions {
  apiKey?: string;
  timeoutMs?: number;
}

export class AnswerAnalyzer {
  private version = ANSWER_ANALYSIS_VERSION;

  constructor(private options: AnalyzerOptions = {}) {}

  public getVersion(): string {
    return this.version;
  }

  public async analyzeAnswer(
    questionId: string,
    questionPrompt: string,
    rawTranscript: string
  ): Promise<AnswerAnalysis> {
    const answerId = `ans_${Date.now()}`;
    const cleanTranscript = this.sanitizeTranscript(rawTranscript);

    // Security & Prompt Injection Check: Never follow instructions embedded in transcript
    if (this.containsPromptInjection(cleanTranscript)) {
      console.warn(`[AnswerAnalyzer] Prompt injection attempt detected in transcript. Falling back to safe UNCLEAR analysis.`);
      return {
        answerId,
        questionId,
        transcript: cleanTranscript,
        completeness: 'LOW',
        relevance: 'LOW',
        depth: 'LOW',
        qualityCategory: 'UNCLEAR',
        conceptsDetected: [],
        skillsDemonstrated: [],
        missingConcepts: ['relevance-to-question'],
        evidence: [{ claim: 'Candidate submitted untrusted prompt instructions instead of direct answer.', confidence: 'HIGH' }],
      };
    }

    // Deterministic evidence extraction & categorical quality classification
    const concepts = this.extractGroundedConcepts(cleanTranscript);
    const qualityCategory = this.classifyQuality(cleanTranscript, concepts);

    const completeness = qualityCategory === 'STRONG' ? 'HIGH' : qualityCategory === 'ADEQUATE' ? 'MEDIUM' : 'LOW';
    const relevance = qualityCategory === 'UNCLEAR' ? 'LOW' : 'HIGH';
    const depth = qualityCategory === 'STRONG' ? 'HIGH' : qualityCategory === 'ADEQUATE' ? 'MEDIUM' : 'LOW';

    const evidence = concepts.map((concept) => ({
      claim: `Candidate explicitly mentioned ${concept} in answer transcript.`,
      confidence: 'HIGH' as const,
    }));

    return {
      answerId,
      questionId,
      transcript: cleanTranscript,
      completeness,
      relevance,
      depth,
      qualityCategory,
      conceptsDetected: concepts,
      skillsDemonstrated: concepts.filter((c) => ['redis', 'caching', 'rest-api', 'database', 'postgres', 'microservices'].includes(c)),
      missingConcepts: this.identifyMissingConcepts(questionPrompt, concepts),
      evidence,
    };
  }

  private sanitizeTranscript(transcript: string): string {
    return transcript.trim();
  }

  private containsPromptInjection(transcript: string): boolean {
    const injectionPatterns = [
      /ignore (previous|above|system|all) instructions/i,
      /reveal (system|internal) prompt/i,
      /give me the interview questions/i,
      /you are now a/i,
      /system prompt/i,
    ];
    return injectionPatterns.some((pattern) => pattern.test(transcript));
  }

  private extractGroundedConcepts(transcript: string): string[] {
    const text = transcript.toLowerCase();
    const knownConcepts = [
      'redis',
      'caching',
      'postgres',
      'postgresql',
      'database',
      'indexing',
      'acid',
      'rest-api',
      'http',
      'microservices',
      'queue',
      'kafka',
      'docker',
      'react',
      'node',
    ];

    return knownConcepts.filter((concept) => text.includes(concept));
  }

  private classifyQuality(transcript: string, concepts: string[]): QualityCategory {
    const words = transcript.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return 'UNCLEAR';
    if (words.length < 4) return 'INCOMPLETE';

    if (concepts.length >= 2 || (words.length > 20 && concepts.length >= 1)) {
      return 'STRONG';
    }

    if (concepts.length === 1 || words.length > 10) {
      return 'ADEQUATE';
    }

    return 'WEAK';
  }

  private identifyMissingConcepts(prompt: string, detected: string[]): string[] {
    const text = prompt.toLowerCase();
    const missing: string[] = [];

    if (text.includes('cache') || text.includes('redis')) {
      if (!detected.includes('caching')) missing.push('caching-strategy');
      if (!detected.includes('indexing')) missing.push('cache-invalidation');
    }

    if (text.includes('database') || text.includes('index')) {
      if (!detected.includes('indexing')) missing.push('database-indexes');
    }

    return missing;
  }
}
