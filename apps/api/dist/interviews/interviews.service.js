"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@ai-interviewer/shared");
let InterviewsService = class InterviewsService {
    constructor() {
        this.sessions = new Map();
    }
    createSession(dto) {
        const parseResult = shared_1.createSessionSchema.safeParse(dto);
        if (!parseResult.success) {
            throw new common_1.BadRequestException({
                message: 'Invalid session payload',
                errors: parseResult.error.flatten().fieldErrors,
            });
        }
        const { candidateName, role, type, durationMinutes } = parseResult.data;
        const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const session = {
            id,
            candidateName,
            role,
            type,
            durationMinutes,
            status: 'CREATED',
            currentStage: 'INTRO',
            createdAt: new Date().toISOString(),
        };
        this.sessions.set(id, session);
        return session;
    }
    getSession(id) {
        const session = this.sessions.get(id);
        if (!session) {
            throw new common_1.NotFoundException(`Interview session with ID '${id}' was not found`);
        }
        return session;
    }
    startSession(id) {
        const session = this.getSession(id);
        if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
            throw new common_1.BadRequestException(`Cannot start interview session with status '${session.status}'`);
        }
        if (session.status === 'IN_PROGRESS') {
            return session;
        }
        session.status = 'IN_PROGRESS';
        session.currentStage = 'TECHNICAL';
        if (!session.startedAt) {
            session.startedAt = new Date().toISOString();
        }
        this.sessions.set(id, session);
        return session;
    }
    endSession(id) {
        const session = this.getSession(id);
        if (session.status === 'COMPLETED') {
            return session;
        }
        if (session.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cannot end a cancelled interview session');
        }
        session.status = 'COMPLETED';
        session.currentStage = 'COMPLETION';
        session.completedAt = new Date().toISOString();
        this.sessions.set(id, session);
        return session;
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)()
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map