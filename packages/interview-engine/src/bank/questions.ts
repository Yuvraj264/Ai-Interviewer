import { EngineQuestion, InterviewType } from '@ai-interviewer/shared';

export const QUESTION_BANK: EngineQuestion[] = [
  {
    id: 'q_intro_01',
    stage: 'INTRO',
    topic: 'introduction',
    difficulty: 'easy',
    prompt: 'Could you briefly introduce yourself and give an overview of your background?',
    objective: 'Evaluate communication clarity and introductory presentation.',
  },
  {
    id: 'q_bg_01',
    stage: 'BACKGROUND',
    topic: 'career-history',
    difficulty: 'easy',
    prompt: 'What area of software engineering interests you most, and what has been your main focus recently?',
    objective: 'Understand technical trajectory and primary domain experience.',
  },
  {
    id: 'q_proj_01',
    stage: 'PROJECT_DEEP_DIVE',
    topic: 'architecture',
    difficulty: 'medium',
    prompt: 'Tell me about a complex project you built recently. What key architectural decisions did you make?',
    objective: 'Evaluate architectural decision making and technical depth.',
  },
  {
    id: 'q_tech_rest_01',
    stage: 'TECHNICAL',
    topic: 'rest-api',
    difficulty: 'medium',
    prompt: 'Could you explain the core constraints of REST APIs and how HTTP verbs map to CRUD operations?',
    objective: 'Evaluate Web & API design knowledge.',
  },
  {
    id: 'q_tech_db_01',
    stage: 'TECHNICAL',
    topic: 'databases',
    difficulty: 'medium',
    prompt: 'How do database indexes improve query speed, and what overhead do they introduce on write operations?',
    objective: 'Evaluate database performance and index mechanics.',
  },
  {
    id: 'q_tech_sys_01',
    stage: 'TECHNICAL',
    topic: 'system-design',
    difficulty: 'hard',
    prompt: 'How would you design a scalable background job processing queue to handle millions of tasks reliably?',
    objective: 'Evaluate distributed systems and queueing knowledge.',
  },
  {
    id: 'q_beh_01',
    stage: 'BEHAVIORAL',
    topic: 'team-conflict',
    difficulty: 'medium',
    prompt: 'Tell me about a time you disagreed with a technical decision made by your team. How did you resolve it?',
    objective: 'Evaluate interpersonal communication and conflict resolution.',
  },
  {
    id: 'q_closing_01',
    stage: 'CLOSING',
    topic: 'conclusion',
    difficulty: 'easy',
    prompt: 'That concludes our formal questions. Do you have any questions for me or final thoughts to share?',
    objective: 'Provide candidate closing opportunity.',
  },
];

export function getQuestionsForType(type: InterviewType): EngineQuestion[] {
  if (type === 'behavioral') {
    return QUESTION_BANK.filter((q) => ['INTRO', 'BACKGROUND', 'BEHAVIORAL', 'CLOSING'].includes(q.stage));
  }
  if (type === 'technical') {
    return QUESTION_BANK.filter((q) => ['INTRO', 'BACKGROUND', 'PROJECT_DEEP_DIVE', 'TECHNICAL', 'CLOSING'].includes(q.stage));
  }
  return QUESTION_BANK;
}
