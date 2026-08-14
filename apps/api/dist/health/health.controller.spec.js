"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const health_controller_1 = require("./health.controller");
(0, vitest_1.describe)('HealthController', () => {
    let healthController;
    (0, vitest_1.beforeEach)(() => {
        healthController = new health_controller_1.HealthController();
    });
    (0, vitest_1.it)('should return health status with status ok and service api', () => {
        const response = healthController.getHealth();
        (0, vitest_1.expect)(response.status).toBe('ok');
        (0, vitest_1.expect)(response.service).toBe('api');
        (0, vitest_1.expect)(response.phase).toBe('Phase 1 — Foundation');
        (0, vitest_1.expect)(typeof response.timestamp).toBe('string');
    });
});
//# sourceMappingURL=health.controller.spec.js.map