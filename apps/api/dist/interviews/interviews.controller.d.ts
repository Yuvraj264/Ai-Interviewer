import { InterviewsService } from './interviews.service';
import { CreateSessionDto, InterviewSession, ApiResponse } from '@ai-interviewer/shared';
export declare class InterviewsController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    createSession(dto: CreateSessionDto): ApiResponse<{
        session: InterviewSession;
    }>;
    getSession(id: string): ApiResponse<{
        session: InterviewSession;
    }>;
    startSession(id: string): ApiResponse<{
        session: InterviewSession;
    }>;
    endSession(id: string): ApiResponse<{
        session: InterviewSession;
    }>;
}
//# sourceMappingURL=interviews.controller.d.ts.map