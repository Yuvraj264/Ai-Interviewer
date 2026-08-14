"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const safety_controller_1 = require("./safety.controller");
(0, vitest_1.describe)('SafetyController Phase 12 Endpoints', () => {
    let controller;
    (0, vitest_1.beforeEach)(() => {
        controller = new safety_controller_1.SafetyController();
    });
    (0, vitest_1.it)('should return 100% clean safety audit report', () => {
        const res = controller.getSafetyAudit();
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.status).toBe('SAFE');
        (0, vitest_1.expect)(res.data?.questionSafetyPercentage).toBe(100.0);
        (0, vitest_1.expect)(res.data?.promptInjectionResistancePercentage).toBe(100.0);
    });
    (0, vitest_1.it)('should execute red-team attack suite and report 100% attack containment', () => {
        const res = controller.runRedTeam();
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.totalAttacks).toBe(7);
        (0, vitest_1.expect)(res.data?.containedCount).toBe(7);
    });
});
//# sourceMappingURL=safety.controller.spec.js.map