"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const interviews_service_1 = require("./interviews.service");
const realtime_service_1 = require("./realtime.service");
const common_1 = require("@nestjs/common");
(0, vitest_1.describe)('RealtimeService Token Authorization', () => {
    let interviewsService;
    let realtimeService;
    (0, vitest_1.beforeEach)(() => {
        interviewsService = new interviews_service_1.InterviewsService();
        realtimeService = new realtime_service_1.RealtimeService(interviewsService);
    });
    (0, vitest_1.it)('should generate valid LiveKit token for active session', async () => {
        const session = interviewsService.createSession({
            candidateName: 'David Miller',
            role: 'Staff Engineer',
            type: 'technical',
            durationMinutes: 20,
        });
        const res = await realtimeService.generateCandidateToken(session.id);
        (0, vitest_1.expect)(res.token).toBeDefined();
        (0, vitest_1.expect)(typeof res.token).toBe('string');
        (0, vitest_1.expect)(res.roomName).toBe(`interview:${session.id}`);
        (0, vitest_1.expect)(res.participantIdentity).toBe(`candidate-${session.id}`);
        (0, vitest_1.expect)(res.url).toBeDefined();
    });
    (0, vitest_1.it)('should throw NotFoundException for non-existent session ID', async () => {
        await (0, vitest_1.expect)(realtimeService.generateCandidateToken('invalid_session_id')).rejects.toThrow(common_1.NotFoundException);
    });
    (0, vitest_1.it)('should throw BadRequestException for completed session', async () => {
        const session = interviewsService.createSession({
            candidateName: 'Eve',
            role: 'DevOps Lead',
            type: 'behavioral',
            durationMinutes: 10,
        });
        interviewsService.endSession(session.id);
        await (0, vitest_1.expect)(realtimeService.generateCandidateToken(session.id)).rejects.toThrow(common_1.BadRequestException);
    });
});
//# sourceMappingURL=realtime.service.spec.js.map