import { ApiResponse, SystemHealth, DeepHealthStatus } from '@ai-interviewer/shared';
export declare class HealthController {
    private readonly startTime;
    getHealth(): ApiResponse<SystemHealth>;
    getReadiness(): ApiResponse<DeepHealthStatus>;
}
//# sourceMappingURL=health.controller.d.ts.map