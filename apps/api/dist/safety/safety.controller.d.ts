import { ApiResponse, SafetyAuditReport, RedTeamTestResult } from '@ai-interviewer/shared';
export declare class SafetyController {
    private redTeamSuite;
    constructor();
    getSafetyAudit(): ApiResponse<SafetyAuditReport>;
    runRedTeam(): ApiResponse<{
        totalAttacks: number;
        containedCount: number;
        results: RedTeamTestResult[];
    }>;
}
//# sourceMappingURL=safety.controller.d.ts.map