"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLoggerService = void 0;
const common_1 = require("@nestjs/common");
let StructuredLoggerService = class StructuredLoggerService {
    redact(message) {
        if (typeof message === 'string') {
            return message
                .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
                .replace(/(bearer\s+)[a-zA-Z0-9._-]+/gi, '$1[REDACTED_TOKEN]')
                .replace(/(key=)[a-zA-Z0-9._-]+/gi, '$1[REDACTED_KEY]');
        }
        if (typeof message === 'object' && message !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(message)) {
                if (['password', 'secret', 'token', 'apiKey', 'authorization', 'resumeText'].includes(key)) {
                    sanitized[key] = '[REDACTED]';
                }
                else {
                    sanitized[key] = this.redact(value);
                }
            }
            return sanitized;
        }
        return message;
    }
    log(message, context) {
        this.output('info', message, context);
    }
    error(message, trace, context) {
        this.output('error', message, context, trace);
    }
    warn(message, context) {
        this.output('warn', message, context);
    }
    debug(message, context) {
        this.output('debug', message, context);
    }
    output(level, message, context, trace) {
        const payload = {
            level,
            message: this.redact(message),
            timestamp: new Date().toISOString(),
        };
        if (typeof context === 'object' && context !== null) {
            payload.context = this.redact(context);
        }
        else if (context) {
            payload.contextName = context;
        }
        if (trace) {
            payload.trace = trace;
        }
        console.log(JSON.stringify(payload));
    }
};
exports.StructuredLoggerService = StructuredLoggerService;
exports.StructuredLoggerService = StructuredLoggerService = __decorate([
    (0, common_1.Injectable)()
], StructuredLoggerService);
//# sourceMappingURL=structured-logger.service.js.map