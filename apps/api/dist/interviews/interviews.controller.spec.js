"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const interviews_service_1 = require("./interviews.service");
const realtime_service_1 = require("./realtime.service");
const interviews_controller_1 = require("./interviews.controller");
const common_1 = require("@nestjs/common");
(0, vitest_1.describe)('InterviewsController REST Endpoints', () => {
    let controller;
    let service;
    let realtimeService;
    (0, vitest_1.beforeEach)(() => {
        service = new interviews_service_1.InterviewsService();
        realtimeService = new realtime_service_1.RealtimeService(service);
        controller = new interviews_controller_1.InterviewsController(service, realtimeService);
    });
    (0, vitest_1.it)('should create an interview session with valid payload', () => {
        const res = controller.createSession({
            candidateName: 'Alice Smith',
            role: 'Staff Engineer',
            type: 'technical',
            durationMinutes: 20,
        });
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.session.id).toBeDefined();
        (0, vitest_1.expect)(res.data?.session.status).toBe('CREATED');
        (0, vitest_1.expect)(res.data?.session.candidateName).toBe('Alice Smith');
    });
    (0, vitest_1.it)('should throw BadRequestException when creating session with invalid payload', () => {
        (0, vitest_1.expect)(() => controller.createSession({
            candidateName: 'A',
            role: '',
            type: 'invalid',
            durationMinutes: 99,
        })).toThrow(common_1.BadRequestException);
    });
    (0, vitest_1.it)('should retrieve existing session by ID', () => {
        const createRes = controller.createSession({
            candidateName: 'Bob',
            role: 'DevOps Lead',
            type: 'behavioral',
            durationMinutes: 10,
        });
        const sessionId = createRes.data.session.id;
        const getRes = controller.getSession(sessionId);
        (0, vitest_1.expect)(getRes.success).toBe(true);
        (0, vitest_1.expect)(getRes.data?.session.id).toBe(sessionId);
    });
    (0, vitest_1.it)('should throw NotFoundException for unknown session ID', () => {
        (0, vitest_1.expect)(() => controller.getSession('non_existent_id')).toThrow(common_1.NotFoundException);
    });
    (0, vitest_1.it)('should generate realtime token via controller endpoint', async () => {
        const createRes = controller.createSession({
            candidateName: 'David',
            role: 'Frontend Dev',
            type: 'mixed',
            durationMinutes: 20,
        });
        const sessionId = createRes.data.session.id;
        const tokenRes = await controller.getRealtimeToken(sessionId);
        (0, vitest_1.expect)(tokenRes.success).toBe(true);
        (0, vitest_1.expect)(tokenRes.data?.token).toBeDefined();
        (0, vitest_1.expect)(tokenRes.data?.roomName).toBe(`interview:${sessionId}`);
    });
});
//# sourceMappingURL=interviews.controller.spec.js.map