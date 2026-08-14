"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterGuard = void 0;
const common_1 = require("@nestjs/common");
let RateLimiterGuard = class RateLimiterGuard {
    constructor() {
        this.requestCounts = new Map();
        this.windowMs = 60 * 1000;
        this.maxRequests = 120;
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const clientIp = req.ip || req.socket.remoteAddress || 'unknown_client';
        const now = Date.now();
        const clientRecord = this.requestCounts.get(clientIp);
        if (!clientRecord || now > clientRecord.resetAt) {
            this.requestCounts.set(clientIp, { count: 1, resetAt: now + this.windowMs });
            return true;
        }
        if (clientRecord.count >= this.maxRequests) {
            throw new common_1.HttpException({
                success: false,
                error: {
                    code: 'RATE_LIMITED',
                    message: 'Too many requests. Please slow down and retry in 1 minute.',
                },
                timestamp: new Date().toISOString(),
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        clientRecord.count++;
        return true;
    }
};
exports.RateLimiterGuard = RateLimiterGuard;
exports.RateLimiterGuard = RateLimiterGuard = __decorate([
    (0, common_1.Injectable)()
], RateLimiterGuard);
//# sourceMappingURL=rate-limiter.guard.js.map