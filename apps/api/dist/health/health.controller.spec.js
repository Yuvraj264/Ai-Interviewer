"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const health_controller_1 = require("./health.controller");
const shared_1 = require("@ai-interviewer/shared");
(0, vitest_1.describe)('HealthController Phase 10 Production Health & Readiness', () => {
    let healthController;
    (0, vitest_1.beforeEach)(() => {
        healthController = new health_controller_1.HealthController();
    });
    (0, vitest_1.it)('should return 200 OK liveness status with Phase 10 metadata', () => {
        const response = healthController.getHealth();
        (0, vitest_1.expect)(response.success).toBe(true);
        (0, vitest_1.expect)(response.data?.status).toBe('ok');
        (0, vitest_1.expect)(response.data?.service).toBe(shared_1.PROJECT_PHASE);
        (0, vitest_1.expect)(typeof response.data?.uptime).toBe('number');
    });
    (0, vitest_1.it)('should return deep readiness status with database, redis, and livekit health metrics', () => {
        const response = healthController.getReadiness();
        (0, vitest_1.expect)(response.success).toBe(true);
        (0, vitest_1.expect)(response.data?.status).toBeDefined();
        (0, vitest_1.expect)(response.data?.services.database).toBe(true);
        (0, vitest_1.expect)(response.data?.services.redis).toBe(true);
    });
});
//# sourceMappingURL=health.controller.spec.js.map