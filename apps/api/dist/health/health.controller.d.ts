import { ApiResponse, SystemHealth, DeepHealthStatus } from '@ai-interviewer/shared';
export declare class HealthController {
    private readonly startTime;
    getHealth(): ApiResponse<SystemHealth>;
    getReadiness(): Promise<ApiResponse<DeepHealthStatus>>;
    getRealtimeHealth(): Promise<ApiResponse<{
        status: 'LIVEKIT_REACHABLE' | 'LIVEKIT_UNAVAILABLE';
        url: string;
    }>>;
    private checkLivekitReachable;
}
//# sourceMappingURL=health.controller.d.ts.map