import { ApiResponse, DemoResetResponse } from '@ai-interviewer/shared';
import { InterviewsService } from '../interviews/interviews.service';
export declare class DemoController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    resetDemo(): ApiResponse<DemoResetResponse>;
    getDemoStatus(): ApiResponse<{
        ready: boolean;
        phase: string;
        activeDemoCandidate: string;
    }>;
}
//# sourceMappingURL=demo.controller.d.ts.map