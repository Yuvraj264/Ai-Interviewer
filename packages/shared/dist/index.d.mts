interface SystemHealth {
    status: 'ok' | 'degraded' | 'down';
    timestamp: string;
    uptime: number;
    environment: string;
    service: string;
}
interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    timestamp: string;
}
declare const PROJECT_PHASE: "Phase 1 \u2014 Foundation";

export { type ApiResponse, PROJECT_PHASE, type SystemHealth };
