import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RateLimiterGuard implements CanActivate {
    private requestCounts;
    private readonly windowMs;
    private readonly maxRequests;
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=rate-limiter.guard.d.ts.map