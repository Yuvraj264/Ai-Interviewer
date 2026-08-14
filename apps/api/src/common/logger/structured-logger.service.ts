import { Injectable, LoggerService } from '@nestjs/common';

export interface LogContext {
  event?: string;
  correlationId?: string;
  sessionId?: string;
  tenantId?: string;
  durationMs?: number;
  [key: string]: unknown;
}

@Injectable()
export class StructuredLoggerService implements LoggerService {
  private redact(message: unknown): unknown {
    if (typeof message === 'string') {
      return message
        .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
        .replace(/(bearer\s+)[a-zA-Z0-9._-]+/gi, '$1[REDACTED_TOKEN]')
        .replace(/(key=)[a-zA-Z0-9._-]+/gi, '$1[REDACTED_KEY]');
    }
    if (typeof message === 'object' && message !== null) {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(message as Record<string, unknown>)) {
        if (['password', 'secret', 'token', 'apiKey', 'authorization', 'resumeText'].includes(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.redact(value);
        }
      }
      return sanitized;
    }
    return message;
  }

  log(message: string, context?: string | LogContext) {
    this.output('info', message, context);
  }

  error(message: string, trace?: string, context?: string | LogContext) {
    this.output('error', message, context, trace);
  }

  warn(message: string, context?: string | LogContext) {
    this.output('warn', message, context);
  }

  debug(message: string, context?: string | LogContext) {
    this.output('debug', message, context);
  }

  private output(level: string, message: string, context?: string | LogContext, trace?: string) {
    const payload: Record<string, unknown> = {
      level,
      message: this.redact(message),
      timestamp: new Date().toISOString(),
    };

    if (typeof context === 'object' && context !== null) {
      payload.context = this.redact(context);
    } else if (context) {
      payload.contextName = context;
    }

    if (trace) {
      payload.trace = trace;
    }

    console.log(JSON.stringify(payload));
  }
}
