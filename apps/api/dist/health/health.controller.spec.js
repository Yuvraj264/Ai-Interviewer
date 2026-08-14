"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const health_controller_1 = require("./health.controller");
const shared_1 = require("@ai-interviewer/shared");
(0, vitest_1.describe)('HealthController', () => {
    let healthController;
    (0, vitest_1.beforeEach)(() => {
        healthController = new health_controller_1.HealthController();
    });
    (0, vitest_1.it)('should return health status with status ok and current project phase', () => {
        const response = healthController.getHealth();
        (0, vitest_1.expect)(response.status).toBe('ok');
        (0, vitest_1.expect)(response.service).toBe('api');
        (0, vitest_1.expect)(response.phase).toBe(shared_1.PROJECT_PHASE);
        (0, vitest_1.expect)(typeof response.timestamp).toBe('string');
    });
});
//# sourceMappingURL=health.controller.spec.js.map