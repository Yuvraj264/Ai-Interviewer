"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const interview_engine_1 = require("@ai-interviewer/interview-engine");
const interviews_service_1 = require("../interviews/interviews.service");
let DashboardService = class DashboardService {
    constructor(interviewsService) {
        this.interviewsService = interviewsService;
        this.analyticsService = new interview_engine_1.AnalyticsService();
    }
    getOverview(organizationId) {
        const sessions = this.interviewsService.getAllSessions();
        const evaluations = this.interviewsService.getAllEvaluations();
        return this.analyticsService.calculateOverviewMetrics(sessions, evaluations, organizationId);
    }
    getCandidates(query, page = 1, limit = 10, organizationId) {
        const profiles = this.interviewsService.getAllCandidateProfiles();
        let filtered = organizationId
            ? profiles.filter((p) => !p.organizationId || p.organizationId === organizationId)
            : profiles;
        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter((p) => p.name?.toLowerCase().includes(q) ||
                p.headline?.toLowerCase().includes(q) ||
                p.skills.some((s) => s.rawName.toLowerCase().includes(q)));
        }
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const startIndex = (page - 1) * limit;
        const items = filtered.slice(startIndex, startIndex + limit);
        return { items, total, page, limit, totalPages };
    }
    getCandidateById(candidateId) {
        const profiles = this.interviewsService.getAllCandidateProfiles();
        const candidate = profiles.find((p) => p.candidateId === candidateId);
        if (!candidate) {
            throw new common_1.NotFoundException(`Candidate profile '${candidateId}' not found`);
        }
        const matches = this.interviewsService.getMatchesForCandidate(candidateId);
        return { candidate, matches };
    }
    getInterviews(status, query, page = 1, limit = 10, organizationId) {
        let sessions = this.interviewsService.getAllSessions();
        if (organizationId) {
            sessions = sessions.filter((s) => !s.organizationId || s.organizationId === organizationId);
        }
        if (status) {
            sessions = sessions.filter((s) => s.status === status);
        }
        if (query) {
            const q = query.toLowerCase();
            sessions = sessions.filter((s) => s.candidateName.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
        }
        const total = sessions.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const startIndex = (page - 1) * limit;
        const items = sessions.slice(startIndex, startIndex + limit);
        return { items, total, page, limit, totalPages };
    }
    getInterviewById(sessionId) {
        const session = this.interviewsService.getSession(sessionId);
        const profileData = this.interviewsService.getProfile(sessionId);
        const evaluation = this.interviewsService.getEvaluation(sessionId);
        return {
            session,
            profile: profileData.candidateProfile,
            job: profileData.jobProfile,
            evaluation,
        };
    }
    getJobs(organizationId) {
        const jobs = this.interviewsService.getAllJobProfiles();
        return organizationId ? jobs.filter((j) => !j.organizationId || j.organizationId === organizationId) : jobs;
    }
    getAnalytics(organizationId) {
        const sessions = this.interviewsService.getAllSessions();
        const evaluations = this.interviewsService.getAllEvaluations();
        const adaptiveRecords = this.interviewsService.getAllAdaptiveRecords();
        return this.analyticsService.calculateAnalyticsData(sessions, evaluations, adaptiveRecords, organizationId);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map