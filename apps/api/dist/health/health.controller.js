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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ai-interviewer/shared");
let HealthController = class HealthController {
    constructor() {
        this.startTime = Date.now();
    }
    getHealth() {
        const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        return {
            success: true,
            data: {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: uptimeSeconds,
                environment: process.env.NODE_ENV || 'development',
                service: shared_1.PROJECT_PHASE,
            },
            timestamp: new Date().toISOString(),
        };
    }
    getReadiness() {
        const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        const services = {
            database: true,
            redis: true,
            livekit: Boolean(process.env.LIVEKIT_API_KEY),
        };
        const isAllOk = Object.values(services).every(Boolean);
        return {
            success: true,
            data: {
                status: isAllOk ? 'ok' : 'degraded',
                timestamp: new Date().toISOString(),
                uptime: uptimeSeconds,
                environment: process.env.NODE_ENV || 'development',
                service: shared_1.PROJECT_PHASE,
                services,
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], HealthController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('readiness'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], HealthController.prototype, "getReadiness", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('health')
], HealthController);
//# sourceMappingURL=health.controller.js.map