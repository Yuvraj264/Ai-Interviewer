import { InterviewsService } from './interviews.service';
import { RealtimeTokenResponse } from '@ai-interviewer/shared';
export declare class RealtimeService {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    generateCandidateToken(sessionId: string): Promise<RealtimeTokenResponse>;
}
//# sourceMappingURL=realtime.service.d.ts.map