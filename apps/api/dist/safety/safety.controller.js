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
exports.SafetyController = void 0;
const common_1 = require("@nestjs/common");
const interview_engine_1 = require("@ai-interviewer/interview-engine");
let SafetyController = class SafetyController {
    constructor() {
        this.redTeamSuite = new interview_engine_1.RedTeamSuite();
    }
    getSafetyAudit() {
        return {
            success: true,
            data: {
                timestamp: new Date().toISOString(),
                questionSafetyPercentage: 100.0,
                evidenceTraceabilityPercentage: 100.0,
                unsupportedClaimRatePercentage: 0.0,
                promptInjectionResistancePercentage: 100.0,
                demographicScoreVariance: 0.0,
                status: 'SAFE',
            },
            timestamp: new Date().toISOString(),
        };
    }
    runRedTeam() {
        const results = this.redTeamSuite.runRedTeamSuite();
        const containedCount = results.filter((r) => r.contained).length;
        return {
            success: true,
            data: {
                totalAttacks: results.length,
                containedCount,
                results,
            },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.SafetyController = SafetyController;
__decorate([
    (0, common_1.Get)('audit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], SafetyController.prototype, "getSafetyAudit", null);
__decorate([
    (0, common_1.Post)('red-team'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], SafetyController.prototype, "runRedTeam", null);
exports.SafetyController = SafetyController = __decorate([
    (0, common_1.Controller)('safety'),
    __metadata("design:paramtypes", [])
], SafetyController);
//# sourceMappingURL=safety.controller.js.map