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
const realtime_service_1 = require("./realtime.service");
let InterviewsController = class InterviewsController {
    constructor(interviewsService, realtimeService) {
        this.interviewsService = interviewsService;
        this.realtimeService = realtimeService;
    }
    createSession(dto) {
        const session = this.interviewsService.createSession(dto);
        return {
            success: true,
            data: { session },
            timestamp: new Date().toISOString(),
        };
    }
    getSession(id) {
        const session = this.interviewsService.getSession(id);
        return {
            success: true,
            data: { session },
            timestamp: new Date().toISOString(),
        };
    }
    startSession(id) {
        const session = this.interviewsService.startSession(id);
        return {
            success: true,
            data: { session },
            timestamp: new Date().toISOString(),
        };
    }
    endSession(id) {
        const session = this.interviewsService.endSession(id);
        return {
            success: true,
            data: { session },
            timestamp: new Date().toISOString(),
        };
    }
    async getRealtimeToken(id) {
        const realtimeData = await this.realtimeService.generateCandidateToken(id);
        return {
            success: true,
            data: realtimeData,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.InterviewsController = InterviewsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
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
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)(':id/end'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], InterviewsController.prototype, "endSession", null);
__decorate([
    (0, common_1.Post)(':id/realtime/token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InterviewsController.prototype, "getRealtimeToken", null);
exports.InterviewsController = InterviewsController = __decorate([
    (0, common_1.Controller)('interviews'),
    __metadata("design:paramtypes", [interviews_service_1.InterviewsService,
        realtime_service_1.RealtimeService])
], InterviewsController);
//# sourceMappingURL=interviews.controller.js.map