"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const demo_controller_1 = require("./demo.controller");
const interviews_service_1 = require("../interviews/interviews.service");
(0, vitest_1.describe)('DemoController Phase 11 Endpoints', () => {
    let controller;
    let interviewsService;
    (0, vitest_1.beforeEach)(() => {
        interviewsService = new interviews_service_1.InterviewsService();
        controller = new demo_controller_1.DemoController(interviewsService);
    });
    (0, vitest_1.it)('should reset demo environment and seed synthetic session cleanly', () => {
        const res = controller.resetDemo();
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.sessionId).toBeDefined();
        (0, vitest_1.expect)(res.data?.message).toContain('Alex Mercer');
    });
    (0, vitest_1.it)('should return demo readiness status', () => {
        const res = controller.getDemoStatus();
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.ready).toBe(true);
        (0, vitest_1.expect)(res.data?.activeDemoCandidate).toBe('Alex Mercer');
    });
});
//# sourceMappingURL=demo.controller.spec.js.map