import { InterviewSession, CreateSessionDto } from '@ai-interviewer/shared';
export declare class InterviewsService {
    private sessions;
    createSession(dto: CreateSessionDto): InterviewSession;
    getSession(id: string): InterviewSession;
    startSession(id: string): InterviewSession;
    endSession(id: string): InterviewSession;
}
//# sourceMappingURL=interviews.service.d.ts.map