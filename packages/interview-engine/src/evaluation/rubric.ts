import { EvaluationDimension } from '@ai-interviewer/shared';

export interface RubricDefinition {
  version: string;
  role: string;
  dimensions: Array<Omit<EvaluationDimension, 'score' | 'status' | 'confidence' | 'evidence' | 'limitations'>>;
}

export const BACKEND_ENGINEER_RUBRIC_V1: RubricDefinition = {
  version: 'BACKEND_ENGINEER_RUBRIC_V1',
  role: 'Backend Engineer',
  dimensions: [
    {
      dimensionId: 'technical-knowledge',
      name: 'Technical Knowledge',
      description: 'Understanding of foundational software engineering, APIs, data structures, and core concepts.',
      weight: 30,
      required: true,
    },
    {
      dimensionId: 'system-design',
      name: 'System Design & Tradeoffs',
      description: 'Ability to evaluate architecture, failure domains, scalability, database design, and tradeoffs.',
      weight: 25,
      required: true,
    },
    {
      dimensionId: 'problem-solving',
      name: 'Problem Solving & Reasoning',
      description: 'Approach to debugging, edge cases, system bottlenecks, and technical decision making.',
      weight: 25,
      required: true,
    },
    {
      dimensionId: 'communication',
      name: 'Technical Communication',
      description: 'Clarity, conciseness, structured explanations, and effective technical discussion.',
      weight: 20,
      required: false,
    },
  ],
};

export const DEFAULT_TECHNICAL_RUBRIC_V1: RubricDefinition = BACKEND_ENGINEER_RUBRIC_V1;

export class EvaluationRubric {
  public static getRubricForRole(role: string): RubricDefinition {
    const normalizedRole = role.toLowerCase();
    if (normalizedRole.includes('backend') || normalizedRole.includes('full stack') || normalizedRole.includes('staff')) {
      return BACKEND_ENGINEER_RUBRIC_V1;
    }
    return DEFAULT_TECHNICAL_RUBRIC_V1;
  }
}
