"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const interviews_controller_1 = require("./interviews.controller");
const interviews_service_1 = require("./interviews.service");
(0, vitest_1.describe)('InterviewsController Phase 7 Intelligence Endpoints', () => {
    let controller;
    let service;
    (0, vitest_1.beforeEach)(() => {
        service = new interviews_service_1.InterviewsService();
        controller = new interviews_controller_1.InterviewsController(service);
    });
    (0, vitest_1.it)('should create interview session with resume and JD text', () => {
        const response = controller.createSession({
            candidateName: 'Sam Developer',
            role: 'Staff Engineer',
            type: 'technical',
            durationMinutes: 20,
            resumeText: 'Built PrimeBank using Spring Boot, PostgreSQL, and Redis.',
            jobDescriptionText: 'Required: PostgreSQL and Node.js.',
        });
        (0, vitest_1.expect)(response.success).toBe(true);
        (0, vitest_1.expect)(response.data?.id).toBeDefined();
        (0, vitest_1.expect)(response.data?.status).toBe('CREATED');
    });
    (0, vitest_1.it)('should support posting resume, job description, and preparing interview targets', () => {
        const createRes = controller.createSession({
            candidateName: 'Sam Developer',
            role: 'Backend Engineer',
        });
        const id = createRes.data.id;
        const resumeRes = controller.parseResume(id, { resumeText: 'Built PrimeBank using Spring Boot, PostgreSQL, and Redis.' });
        (0, vitest_1.expect)(resumeRes.success).toBe(true);
        (0, vitest_1.expect)(resumeRes.data?.skills.length).toBeGreaterThan(0);
        const jdRes = controller.parseJobDescription(id, { jobDescriptionText: 'Required: PostgreSQL and Redis.' });
        (0, vitest_1.expect)(jdRes.success).toBe(true);
        (0, vitest_1.expect)(jdRes.data?.requiredSkills.length).toBeGreaterThan(0);
        const profileRes = controller.getProfile(id);
        (0, vitest_1.expect)(profileRes.success).toBe(true);
        (0, vitest_1.expect)(profileRes.data?.candidateProfile).toBeDefined();
        const prepRes = controller.prepareInterview(id);
        (0, vitest_1.expect)(prepRes.success).toBe(true);
        (0, vitest_1.expect)(prepRes.data?.match.interviewTargets.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(prepRes.data?.turnContext.candidateSummary).toBeDefined();
    });
});
//# sourceMappingURL=interviews.controller.spec.js.map