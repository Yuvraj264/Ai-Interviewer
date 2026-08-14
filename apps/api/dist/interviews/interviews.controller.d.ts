import { InterviewsService } from './interviews.service';
import { RealtimeService } from './realtime.service';
import { CreateSessionDto, InterviewSession, RealtimeTokenResponse, ApiResponse } from '@ai-interviewer/shared';
export declare class InterviewsController {
    private readonly interviewsService;
    private readonly realtimeService;
    constructor(interviewsService: InterviewsService, realtimeService: RealtimeService);
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
    getRealtimeToken(id: string): Promise<ApiResponse<RealtimeTokenResponse>>;
}
//# sourceMappingURL=interviews.controller.d.ts.map