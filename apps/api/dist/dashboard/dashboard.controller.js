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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const dashboard_service_1 = require("./dashboard.service");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    getOverview(orgId) {
        const overview = this.dashboardService.getOverview(orgId);
        return {
            success: true,
            data: overview,
            timestamp: new Date().toISOString(),
        };
    }
    getCandidates(query, page = '1', limit = '10', orgId) {
        const paginated = this.dashboardService.getCandidates(query, Number(page), Number(limit), orgId);
        return {
            success: true,
            data: paginated,
            timestamp: new Date().toISOString(),
        };
    }
    getCandidateById(id) {
        const result = this.dashboardService.getCandidateById(id);
        return {
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        };
    }
    getInterviews(status, query, page = '1', limit = '10', orgId) {
        const paginated = this.dashboardService.getInterviews(status, query, Number(page), Number(limit), orgId);
        return {
            success: true,
            data: paginated,
            timestamp: new Date().toISOString(),
        };
    }
    getInterviewById(id) {
        const result = this.dashboardService.getInterviewById(id);
        return {
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
        };
    }
    getJobs(orgId) {
        const jobs = this.dashboardService.getJobs(orgId);
        return {
            success: true,
            data: jobs,
            timestamp: new Date().toISOString(),
        };
    }
    getAnalytics(orgId) {
        const analytics = this.dashboardService.getAnalytics(orgId);
        return {
            success: true,
            data: analytics,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, common_1.Query)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('candidates'),
    __param(0, (0, common_1.Query)('query')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getCandidates", null);
__decorate([
    (0, common_1.Get)('candidates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getCandidateById", null);
__decorate([
    (0, common_1.Get)('interviews'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('query')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, String]),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getInterviews", null);
__decorate([
    (0, common_1.Get)('interviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getInterviewById", null);
__decorate([
    (0, common_1.Get)('jobs'),
    __param(0, (0, common_1.Query)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Query)('orgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], DashboardController.prototype, "getAnalytics", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map