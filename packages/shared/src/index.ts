export * from './session.schema';

export type SessionStatus = 'CREATED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InterviewStage =
  | 'CREATED'
  | 'WAITING'
  | 'INTRO'
  | 'BACKGROUND'
  | 'PROJECT_DEEP_DIVE'
  | 'TECHNICAL'
  | 'BEHAVIORAL'
  | 'CLOSING'
  | 'COMPLETING'
  | 'COMPLETION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED';

export type InterviewType = 'technical' | 'behavioral' | 'mixed';

export interface InterviewSession {
  id: string;
  candidateName: string;
  role: string;
  type: InterviewType;
  durationMinutes: number;
  status: SessionStatus;
  currentStage: InterviewStage;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  resumeText?: string;
  jobDescriptionText?: string;
  organizationId?: string;
}

export type RealtimeConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'FAILED';

export type MicrophoneState = 'IDLE' | 'REQUESTING' | 'ACTIVE' | 'DENIED' | 'ERROR';

export type AiConversationState =
  | 'IDLE'
  | 'CONNECTING'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'RECONNECTING'
  | 'ERROR'
  | 'ENDING';

export type EngineQuestionState =
  | 'CREATED'
  | 'ASKING'
  | 'WAITING_FOR_ANSWER'
  | 'ANSWERING'
  | 'ANSWER_RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED';

export type EngineEventType =
  | 'INTERVIEW_STARTED'
  | 'QUESTION_STARTED'
  | 'CANDIDATE_ANSWER_RECEIVED'
  | 'QUESTION_COMPLETED'
  | 'STAGE_COMPLETED'
  | 'TIME_LIMIT_REACHED'
  | 'QUESTION_LIMIT_REACHED'
  | 'INTERVIEW_ENDED'
  | 'INTERVIEW_CANCELLED';

export interface EngineQuestion {
  id: string;
  stage: InterviewStage;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  objective: string;
}

export interface InterviewConfig {
  type: InterviewType;
  durationMinutes: number;
  maxQuestions: number;
  stages: InterviewStage[];
  topics: string[];
  difficulty: string;
}

export interface InterviewEngineState {
  sessionId: string;
  status: SessionStatus;
  stage: InterviewStage;
  currentQuestionIndex: number;
  currentQuestion?: EngineQuestion;
  currentQuestionState?: EngineQuestionState;
  coveredTopics: string[];
  remainingTopics: string[];
  askedQuestionIds: string[];
  startedAt?: string;
  elapsedSeconds: number;
  remainingSeconds: number;
  questionsAsked: number;
  questionsRemaining: number;
  isCompleted: boolean;
}

export type QualityCategory = 'STRONG' | 'ADEQUATE' | 'WEAK' | 'INCOMPLETE' | 'UNCLEAR';

export type AdaptiveAction =
  | 'FOLLOW_UP'
  | 'PROBE'
  | 'CLARIFY'
  | 'INCREASE_DIFFICULTY'
  | 'DECREASE_DIFFICULTY'
  | 'NEW_TOPIC'
  | 'REVISIT_TOPIC'
  | 'TRANSITION_STAGE';

export interface EvidenceItem {
  claim: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AnswerAnalysis {
  answerId: string;
  questionId: string;
  transcript: string;
  completeness: 'LOW' | 'MEDIUM' | 'HIGH';
  relevance: 'LOW' | 'MEDIUM' | 'HIGH';
  depth: 'LOW' | 'MEDIUM' | 'HIGH';
  qualityCategory: QualityCategory;
  conceptsDetected: string[];
  skillsDemonstrated: string[];
  missingConcepts: string[];
  evidence: EvidenceItem[];
}

export interface AdaptiveDecision {
  action: AdaptiveAction;
  targetTopic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  rationale: string;
  confidence: number;
  basedOnQuestionId: string;
}

export interface AdaptiveDecisionRecord {
  sessionId: string;
  previousQuestionId: string;
  analysis: AnswerAnalysis;
  decision: AdaptiveDecision;
  selectedQuestionId: string;
  validationResult: 'ACCEPTED' | 'FALLBACK_USED';
  timestamp: string;
}

// Phase 7 Resume & JD Intelligence Types
export type VerificationStatus = 'UNVERIFIED' | 'PARTIALLY_VERIFIED' | 'SUPPORTED' | 'CONTRADICTORY';
export type TargetType =
  | 'VERIFY_RESUME_CLAIM'
  | 'TEST_REQUIRED_SKILL'
  | 'DEEP_DIVE_PROJECT'
  | 'EXPLORE_GAP'
  | 'VERIFY_EXPERIENCE'
  | 'BEHAVIORAL';
export type TargetStatus = 'PENDING' | 'IN_PROGRESS' | 'SUFFICIENTLY_VERIFIED' | 'INSUFFICIENT_EVIDENCE' | 'SKIPPED';
export type DocumentProcessingStatus = 'NOT_PROCESSED' | 'PROCESSING' | 'READY' | 'FAILED';

export interface CandidateSkill {
  canonicalName: string;
  rawName: string;
  category: string;
  source: 'resume';
  evidence: string;
  verificationStatus: VerificationStatus;
}

export interface CandidateProject {
  name: string;
  description: string;
  technologies: string[];
  role?: string;
  outcomes?: string[];
}

export interface CandidateExperience {
  company: string;
  role: string;
  startDate?: string;
  endDate?: string;
  responsibilities: string[];
  technologies: string[];
}

export interface CandidateProfile {
  candidateId: string;
  name?: string;
  headline?: string;
  summary?: string;
  education: Array<{ institution: string; degree: string; field?: string }>;
  experience: CandidateExperience[];
  projects: CandidateProject[];
  skills: CandidateSkill[];
  sourceDocumentId?: string;
  organizationId?: string;
}

export interface SkillRequirement {
  skill: string;
  importance: 'CORE' | 'IMPORTANT' | 'OPTIONAL';
  isRequired: boolean;
  evidence?: string;
}

export interface JobProfile {
  jobId: string;
  title: string;
  company?: string;
  seniority?: string;
  summary?: string;
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
  responsibilities: string[];
  qualifications: string[];
  domains: string[];
  organizationId?: string;
}

export interface InterviewTarget {
  id: string;
  type: TargetType;
  topic: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationGoal: string;
  status: TargetStatus;
}

export interface CandidateJobProfile {
  candidateId: string;
  jobId: string;
  matchedSkills: string[];
  missingSkills: string[];
  unverifiedSkills: string[];
  relevantProjects: CandidateProject[];
  interviewTargets: InterviewTarget[];
}

// Phase 8 Evaluation Types
export type EvidenceType = 'DIRECT' | 'INDIRECT' | 'WEAK' | 'CONTRADICTORY';
export type RequirementCoverageStatus =
  | 'NOT_TESTED'
  | 'PARTIALLY_TESTED'
  | 'SUPPORTED'
  | 'STRONGLY_SUPPORTED'
  | 'CONTRADICTORY';
export type EvaluationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NEEDS_REVIEW';

export interface EvaluationEvidence {
  id: string;
  questionId: string;
  answerId: string;
  dimensionId: string;
  evidenceType: EvidenceType;
  summary: string;
  transcriptReference?: string;
  confidence: number;
}

export interface EvaluationDimension {
  dimensionId: string;
  name: string;
  description: string;
  weight: number;
  required: boolean;
  score?: number;
  status: 'EVALUATED' | 'INSUFFICIENT_EVIDENCE';
  confidence: number;
  evidence: EvaluationEvidence[];
  limitations: string[];
}

export interface RequirementEvaluation {
  skillOrRequirement: string;
  status: RequirementCoverageStatus;
  evidenceSummary: string;
  supportingQuestions: string[];
  confidence: number;
}

export interface InterviewEvaluation {
  evaluationId: string;
  interviewId: string;
  status: EvaluationStatus;
  evaluatedDimensions: EvaluationDimension[];
  requirementEvaluations: RequirementEvaluation[];
  evaluationCoverage: {
    totalDimensions: number;
    evaluatedDimensionsCount: number;
    isComplete: boolean;
  };
  rubricVersion: string;
  promptVersion: string;
  modelVersion: string;
  timestamp: string;
}

export interface HumanReviewOverride {
  score: number;
  note: string;
}

export interface HumanReview {
  reviewId: string;
  evaluationId: string;
  reviewerId: string;
  reviewerName: string;
  humanOverrides: Record<string, HumanReviewOverride>;
  overallDecisionNote?: string;
  timestamp: string;
}

// Phase 9 Dashboard & Analytics Types
export interface DashboardOverviewMetrics {
  totalInterviews: number;
  activeInterviews: number;
  completedInterviews: number;
  pendingEvaluations: number;
  interviewsNeedingReview: number;
  completionRatePercentage: number;
  averageDurationMinutes: number;
  averageRequirementCoveragePercentage: number;
}

export interface AnalyticsData {
  operational: {
    startedCount: number;
    completedCount: number;
    completionRate: number;
    avgDurationMinutes: number;
    avgQuestionCount: number;
  };
  aiBehavior: {
    adaptiveFollowUpRate: number;
    fallbackRate: number;
    avgAdaptiveLatencyMs: number;
    topicDistribution: Record<string, number>;
  };
  evaluation: {
    evaluationCompletionRate: number;
    insufficientEvidenceRate: number;
    humanReviewRate: number;
    avgProcessingTimeMs: number;
  };
  requirementCoverage: {
    mostUntestedRequirements: string[];
    coverageByJob: Record<string, number>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecruiterTenantContext {
  recruiterId: string;
  recruiterName: string;
  organizationId: string;
  role: 'ADMIN' | 'RECRUITER' | 'REVIEWER';
}

// Phase 10 Production Hardening & Load Test Types
export interface DeepHealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
  services: {
    database: boolean;
    redis: boolean;
    livekit: boolean;
  };
}

export interface LoadTestResult {
  concurrency: number;
  durationSeconds: number;
  totalRequests: number;
  rps: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  errorRatePercentage: number;
  bottleneck: string;
}

// Phase 11 Synthetic Demo Fixtures
export const DEMO_SYNTHETIC_CANDIDATE: CandidateProfile = {
  candidateId: 'cand_demo_alex',
  name: 'Alex Mercer',
  headline: 'Senior Backend Engineer',
  summary: 'Architected PrimeBank microservices handling high-throughput payments using Spring Boot, PostgreSQL indexing, and Redis write-through caching.',
  education: [{ institution: 'State University', degree: 'B.S. Computer Science' }],
  experience: [
    {
      company: 'PrimeBank Financial',
      role: 'Senior Backend Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      responsibilities: [
        'Built PrimeBank payment gateway microservices handling 10,000+ RPS.',
        'Optimized PostgreSQL database query performance with composite B-tree indexing.',
        'Implemented Redis write-through caching with TTL eviction rules for volatile sessions.',
      ],
      technologies: ['Spring Boot', 'PostgreSQL', 'Redis', 'Docker'],
    },
  ],
  projects: [
    {
      name: 'PrimeBank High-Throughput Core',
      description: 'Distributed payment processing architecture with Redis cache and PostgreSQL isolation.',
      technologies: ['Spring Boot', 'PostgreSQL', 'Redis'],
    },
  ],
  skills: [
    { canonicalName: 'PostgreSQL', rawName: 'Postgres', category: 'Database', source: 'resume', evidence: 'Architected PrimeBank payment DB', verificationStatus: 'SUPPORTED' },
    { canonicalName: 'Redis', rawName: 'Redis', category: 'Cache', source: 'resume', evidence: 'Implemented Redis caching', verificationStatus: 'SUPPORTED' },
    { canonicalName: 'Kubernetes', rawName: 'K8s', category: 'DevOps', source: 'resume', evidence: 'Resume claim', verificationStatus: 'UNVERIFIED' },
  ],
  organizationId: 'org_scaler_demo',
};

export const DEMO_SYNTHETIC_JOB: JobProfile = {
  jobId: 'job_demo_backend',
  title: 'Senior Backend Engineer',
  company: 'PrimeBank FinTech',
  seniority: 'Senior',
  summary: 'Seeking a Senior Backend Engineer to lead high-throughput financial API microservices, cache invalidation, and database query optimization.',
  requiredSkills: [
    { skill: 'PostgreSQL', importance: 'CORE', isRequired: true, evidence: 'Transaction consistency and indexing' },
    { skill: 'System Design', importance: 'CORE', isRequired: true, evidence: 'High-throughput microservices architecture' },
    { skill: 'Redis', importance: 'IMPORTANT', isRequired: true, evidence: 'Caching & TTL eviction strategies' },
  ],
  preferredSkills: [
    { skill: 'Kubernetes', importance: 'OPTIONAL', isRequired: false },
    { skill: 'AWS', importance: 'OPTIONAL', isRequired: false },
  ],
  responsibilities: [
    'Design and maintain scalable REST APIs.',
    'Optimize PostgreSQL transaction isolation and database query performance.',
    'Manage distributed caching with Redis.',
  ],
  qualifications: ['5+ years software engineering experience', 'Strong system design skills'],
  domains: ['FinTech', 'Distributed Systems'],
  organizationId: 'org_scaler_demo',
};

export interface DemoResetResponse {
  success: boolean;
  sessionId: string;
  message: string;
  timestamp: string;
}

export interface TranscriptItem {
  id: string;
  speaker: 'ai' | 'candidate';
  text: string;
  timestamp: string;
}

export interface RealtimeTokenResponse {
  token: string;
  url: string;
  roomName: string;
  participantIdentity: string;
}

export interface SystemHealth {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

export const PROJECT_PHASE = 'Phase 11 — Founder Demo, Product Excellence & AI Interview Quality' as const;
