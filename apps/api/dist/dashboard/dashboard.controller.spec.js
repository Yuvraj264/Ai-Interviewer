"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
const interviews_service_1 = require("../interviews/interviews.service");
(0, vitest_1.describe)('DashboardController Phase 9 Endpoints', () => {
    let controller;
    let interviewsService;
    let dashboardService;
    (0, vitest_1.beforeEach)(() => {
        interviewsService = new interviews_service_1.InterviewsService();
        dashboardService = new dashboard_service_1.DashboardService(interviewsService);
        controller = new dashboard_controller_1.DashboardController(dashboardService);
    });
    (0, vitest_1.it)('should return overview metrics and handle empty dataset cleanly', () => {
        const res = controller.getOverview();
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.totalInterviews).toBe(0);
        (0, vitest_1.expect)(res.data?.completionRatePercentage).toBe(0);
    });
    (0, vitest_1.it)('should return paginated interviews list with filtering and search', () => {
        interviewsService.createSession({ candidateName: 'Alex Mercer', role: 'Staff Engineer' });
        interviewsService.createSession({ candidateName: 'Sam Tech', role: 'Backend Engineer' });
        const res = controller.getInterviews(undefined, 'Alex');
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.total).toBe(1);
        (0, vitest_1.expect)(res.data?.items[0].candidateName).toBe('Alex Mercer');
    });
    (0, vitest_1.it)('should return operational and AI analytics data', () => {
        const res = controller.getAnalytics();
        (0, vitest_1.expect)(res.success).toBe(true);
        (0, vitest_1.expect)(res.data?.operational.startedCount).toBeDefined();
        (0, vitest_1.expect)(res.data?.aiBehavior.fallbackRate).toBeDefined();
    });
});
//# sourceMappingURL=dashboard.controller.spec.js.map