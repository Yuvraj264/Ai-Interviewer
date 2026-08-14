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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsController = void 0;
const common_1 = require("@nestjs/common");
const interviews_service_1 = require("./interviews.service");
let InterviewsController = class InterviewsController {
    constructor(interviewsService) {
        this.interviewsService = interviewsService;
    }
    createSession(body) {
        const session = this.interviewsService.createSession(body);
        return {
            success: true,
            data: session,
            timestamp: new Date().toISOString(),
        };
    }
    getSession(id) {
        const session = this.interviewsService.getSession(id);
        return {
            success: true,
            data: session,
            timestamp: new Date().toISOString(),
        };
    }
    startSession(id) {
        const session = this.interviewsService.startSession(id);
        return {
            success: true,
            data: session,
            timestamp: new Date().toISOString(),
        };
    }
    endSession(id) {
        const session = this.interviewsService.endSession(id);
        return {
            success: true,
            data: session,
            timestamp: new Date().toISOString(),
        };
    }
    parseResume(id, body) {
        const profile = this.interviewsService.parseResume(id, body.resumeText);
        return {
            success: true,
            data: profile,
            timestamp: new Date().toISOString(),
        };
    }
    parseJobDescription(id, body) {
        const profile = this.interviewsService.parseJobDescription(id, body.jobDescriptionText);
        return {
            success: true,
            data: profile,
            timestamp: new Date().toISOString(),
        };
    }
    getProfile(id) {
        const profileData = this.interviewsService.getProfile(id);
        return {
            success: true,
            data: profileData,
            timestamp: new Date().toISOString(),
        };
    }
    prepareInterview(id) {
        const preparedData = this.interviewsService.prepareInterview(id);
        return {
            success: true,
            data: preparedData,
            timestamp: new Date().toISOString(),
        };
    }
    evaluateSession(id) {
        const evaluation = this.interviewsService.evaluateSession(id);
        return {
            success: true,
            data: evaluation,
            timestamp: new Date().toISOString(),
        };
    }
    getEvaluation(id) {
        const evaluation = this.interviewsService.getEvaluation(id);
        return {
            success: true,
            data: evaluation,
            timestamp: new Date().toISOString(),
        };
    }
    submitHumanReview(id, body) {
        const result = this.interviewsService.submitHumanReview(id, body);
        return {
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.InterviewsController = InterviewsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "getSession", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)(':id/end'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "endSession", null);
__decorate([
    (0, common_1.Post)(':id/resume'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "parseResume", null);
__decorate([
    (0, common_1.Post)(':id/jd'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "parseJobDescription", null);
__decorate([
    (0, common_1.Get)(':id/profile'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)(':id/prepare'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "prepareInterview", null);
__decorate([
    (0, common_1.Post)(':id/evaluate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "evaluateSession", null);
__decorate([
    (0, common_1.Get)(':id/evaluation'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "getEvaluation", null);
__decorate([
    (0, common_1.Post)(':id/evaluation/review'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "submitHumanReview", null);
exports.InterviewsController = InterviewsController = __decorate([
    (0, common_1.Controller)('interviews'),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService])
], InterviewsController);
//# sourceMappingURL=interviews.controller.js.map