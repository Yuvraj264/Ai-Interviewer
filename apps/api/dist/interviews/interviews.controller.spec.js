"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const interviews_controller_1 = require("./interviews.controller");
const interviews_service_1 = require("./interviews.service");
(0, vitest_1.describe)('InterviewsController Phase 8 Evaluation Endpoints', () => {
    let controller;
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new interviews_service_1.InterviewsService();
        controller = new interviews_controller_1.InterviewsController(service);
    });
    (0, vitest_1.it)('should create session, trigger evaluation, and fetch evaluation result', () => {
        const createRes = controller.createSession({
            candidateName: 'Sam Developer',
            role: 'Backend Engineer',
        });
        const id = createRes.data.id;
        const evalRes = controller.evaluateSession(id);
        (0, vitest_1.expect)(evalRes.success).toBe(true);
        (0, vitest_1.expect)(evalRes.data?.evaluationId).toBeDefined();
        (0, vitest_1.expect)(evalRes.data?.evaluatedDimensions.length).toBeGreaterThan(0);
        const getEvalRes = controller.getEvaluation(id);
        (0, vitest_1.expect)(getEvalRes.success).toBe(true);
        (0, vitest_1.expect)(getEvalRes.data?.interviewId).toBe(id);
    });
    (0, vitest_1.it)('should support submitting human reviewer overrides', () => {
        const createRes = controller.createSession({
            candidateName: 'Alex Mercer',
            role: 'Staff Engineer',
        });
        const id = createRes.data.id;
        controller.evaluateSession(id);
        const reviewRes = controller.submitHumanReview(id, {
            reviewerId: 'rev_101',
            reviewerName: 'Lead Hiring Manager',
            humanOverrides: {
                'technical-knowledge': { score: 5, note: 'Exceeded expectations on system reliability design.' },
            },
            overallDecisionNote: 'Strong technical evidence observed.',
        });
        (0, vitest_1.expect)(reviewRes.success).toBe(true);
        (0, vitest_1.expect)(reviewRes.data?.review.reviewerName).toBe('Lead Hiring Manager');
        const updatedTechDim = reviewRes.data?.evaluation.evaluatedDimensions.find((d) => d.dimensionId === 'technical-knowledge');
        (0, vitest_1.expect)(updatedTechDim?.score).toBe(5);
    });
});
//# sourceMappingURL=interviews.controller.spec.js.map