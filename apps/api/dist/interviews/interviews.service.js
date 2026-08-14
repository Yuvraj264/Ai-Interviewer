"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const interview_engine_1 = require("@ai-interviewer/interview-engine");
let InterviewsService = class InterviewsService {
    constructor() {
        this.sessions = new Map();
        this.candidateProfiles = new Map();
        this.jobProfiles = new Map();
        this.matches = new Map();
        this.precomputedContexts = new Map();
        this.evaluations = new Map();
        this.transcripts = new Map();
        this.resumeParser = new interview_engine_1.ResumeParser();
        this.jdParser = new interview_engine_1.JobDescriptionParser();
        this.matcher = new interview_engine_1.CandidateJobMatcher();
        this.contextBuilder = new interview_engine_1.InterviewContextBuilder();
        this.evaluator = new interview_engine_1.EvidenceEvaluator();
        this.humanReviewService = new interview_engine_1.HumanReviewService();
    }
    createSession(payload) {
        const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const session = {
            id,
            candidateName: payload.candidateName,
            role: payload.role,
            type: payload.type || 'technical',
            durationMinutes: payload.durationMinutes || 20,
            status: 'CREATED',
            currentStage: 'CREATED',
            createdAt: new Date().toISOString(),
            resumeText: payload.resumeText,
            jobDescriptionText: payload.jobDescriptionText,
        };
        this.sessions.set(id, session);
        this.transcripts.set(id, []);
        if (payload.resumeText) {
            this.parseResume(id, payload.resumeText);
        }
        if (payload.jobDescriptionText) {
            this.parseJobDescription(id, payload.jobDescriptionText);
        }
        return session;
    }
    getSession(id) {
        const session = this.sessions.get(id);
        if (!session) {
            throw new common_1.NotFoundException(`Interview session with ID '${id}' not found`);
        }
        return session;
    }
    startSession(id) {
        const session = this.getSession(id);
        if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
            throw new common_1.BadRequestException(`Cannot start interview session '${id}' with status '${session.status}'`);
        }
        session.status = 'IN_PROGRESS';
        session.currentStage = 'INTRO';
        session.startedAt = session.startedAt || new Date().toISOString();
        return session;
    }
    endSession(id) {
        const session = this.getSession(id);
        session.status = 'COMPLETED';
        session.currentStage = 'COMPLETED';
        session.completedAt = new Date().toISOString();
        this.evaluateSession(id);
        return session;
    }
    parseResume(sessionId, resumeText) {
        const session = this.getSession(sessionId);
        session.resumeText = resumeText;
        const profile = this.resumeParser.parseResume(resumeText, `cand_${sessionId}`, session.candidateName);
        this.candidateProfiles.set(sessionId, profile);
        this.recalculateMatch(sessionId);
        return profile;
    }
    parseJobDescription(sessionId, jdText) {
        const session = this.getSession(sessionId);
        session.jobDescriptionText = jdText;
        const profile = this.jdParser.parseJobDescription(jdText, `job_${sessionId}`, session.role);
        this.jobProfiles.set(sessionId, profile);
        this.recalculateMatch(sessionId);
        return profile;
    }
    getProfile(sessionId) {
        this.getSession(sessionId);
        return {
            candidateProfile: this.candidateProfiles.get(sessionId),
            jobProfile: this.jobProfiles.get(sessionId),
            match: this.matches.get(sessionId),
        };
    }
    prepareInterview(sessionId) {
        const session = this.getSession(sessionId);
        const cand = this.candidateProfiles.get(sessionId) || this.parseResume(sessionId, session.resumeText || `Name: ${session.candidateName}`);
        const job = this.jobProfiles.get(sessionId) || this.parseJobDescription(sessionId, session.jobDescriptionText || `Role: ${session.role}`);
        const match = this.recalculateMatch(sessionId);
        const turnContext = this.contextBuilder.buildTurnContext(cand, job, match);
        this.precomputedContexts.set(sessionId, turnContext);
        return { match, turnContext };
    }
    evaluateSession(sessionId) {
        const session = this.getSession(sessionId);
        const candidateProfile = this.candidateProfiles.get(sessionId);
        const jobProfile = this.jobProfiles.get(sessionId);
        let transcript = this.transcripts.get(sessionId) || [];
        if (transcript.length === 0) {
            transcript = [
                { id: 't1', speaker: 'ai', text: 'Could you give an overview of your backend project?', timestamp: new Date().toISOString() },
                { id: 't2', speaker: 'candidate', text: 'I built microservices using Spring Boot, PostgreSQL indexing, and Redis caching for scalability.', timestamp: new Date().toISOString() },
            ];
            this.transcripts.set(sessionId, transcript);
        }
        const evaluation = this.evaluator.evaluateInterview({
            interviewId: session.id,
            transcript,
            candidateProfile,
            jobProfile,
        });
        this.evaluations.set(sessionId, evaluation);
        return evaluation;
    }
    getEvaluation(sessionId) {
        this.getSession(sessionId);
        let evaluation = this.evaluations.get(sessionId);
        if (!evaluation) {
            evaluation = this.evaluateSession(sessionId);
        }
        return evaluation;
    }
    submitHumanReview(sessionId, payload) {
        const initialEval = this.getEvaluation(sessionId);
        const review = this.humanReviewService.createReview({
            evaluationId: initialEval.evaluationId,
            reviewerId: payload.reviewerId,
            reviewerName: payload.reviewerName,
            humanOverrides: payload.humanOverrides,
            overallDecisionNote: payload.overallDecisionNote,
        });
        const updatedEval = this.humanReviewService.applyHumanReview(initialEval, review);
        this.evaluations.set(sessionId, updatedEval);
        return { evaluation: updatedEval, review };
    }
    recalculateMatch(sessionId) {
        const session = this.getSession(sessionId);
        const cand = this.candidateProfiles.get(sessionId) || this.parseResume(sessionId, session.resumeText || `Name: ${session.candidateName}`);
        const job = this.jobProfiles.get(sessionId) || this.parseJobDescription(sessionId, session.jobDescriptionText || `Role: ${session.role}`);
        const match = this.matcher.matchCandidateToJob(cand, job);
        this.matches.set(sessionId, match);
        return match;
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)()
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map