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
exports.DemoController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ai-interviewer/shared");
const interviews_service_1 = require("../interviews/interviews.service");
let DemoController = class DemoController {
    constructor(interviewsService) {
        this.interviewsService = interviewsService;
    }
    resetDemo() {
        const session = this.interviewsService.createSession({
            candidateName: shared_1.DEMO_SYNTHETIC_CANDIDATE.name || 'Alex Mercer',
            role: shared_1.DEMO_SYNTHETIC_JOB.title,
            type: 'technical',
            durationMinutes: 20,
            resumeText: `Name: ${shared_1.DEMO_SYNTHETIC_CANDIDATE.name}\nHeadline: ${shared_1.DEMO_SYNTHETIC_CANDIDATE.headline}\nSummary: ${shared_1.DEMO_SYNTHETIC_CANDIDATE.summary}\nExperience: PrimeBank microservices, PostgreSQL B-tree indexing, Redis write-through caching.`,
            jobDescriptionText: `Title: ${shared_1.DEMO_SYNTHETIC_JOB.title}\nRequirements: PostgreSQL transaction isolation, Redis caching, System Design microservices.`,
        });
        this.interviewsService.prepareInterview(session.id);
        this.interviewsService.evaluateSession(session.id);
        return {
            success: true,
            data: {
                success: true,
                sessionId: session.id,
                message: `Demo environment reset cleanly. Synthetic candidate Alex Mercer prepared for session ${session.id}.`,
                timestamp: new Date().toISOString(),
            },
            timestamp: new Date().toISOString(),
        };
    }
    getDemoStatus() {
        return {
            success: true,
            data: {
                ready: true,
                phase: shared_1.PROJECT_PHASE,
                activeDemoCandidate: shared_1.DEMO_SYNTHETIC_CANDIDATE.name || 'Alex Mercer',
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.DemoController = DemoController;
__decorate([
    (0, common_1.Post)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DemoController.prototype, "resetDemo", null);
__decorate([
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], DemoController.prototype, "getDemoStatus", null);
exports.DemoController = DemoController = __decorate([
    (0, common_1.Controller)('demo'),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService])
], DemoController);
//# sourceMappingURL=demo.controller.js.map