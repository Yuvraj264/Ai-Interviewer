import { LoggerService } from '@nestjs/common';
export interface LogContext {
    event?: string;
    correlationId?: string;
    sessionId?: string;
    tenantId?: string;
    durationMs?: number;
    [key: string]: unknown;
}
export declare class StructuredLoggerService implements LoggerService {
    private redact;
    log(message: string, context?: string | LogContext): void;
    error(message: string, trace?: string, context?: string | LogContext): void;
    warn(message: string, context?: string | LogContext): void;
    debug(message: string, context?: string | LogContext): void;
    private output;
}
//# sourceMappingURL=structured-logger.service.d.ts.map