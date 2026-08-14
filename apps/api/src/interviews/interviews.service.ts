import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  InterviewSession,
  CreateSessionDto,
  createSessionSchema,
} from '@ai-interviewer/shared';

@Injectable()
export class InterviewsService {
  private sessions = new Map<string, InterviewSession>();

  public createSession(dto: CreateSessionDto): InterviewSession {
    const parseResult = createSessionSchema.safeParse(dto);
    if (!parseResult.success) {
      throw new BadRequestException({
        message: 'Invalid session payload',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { candidateName, role, type, durationMinutes } = parseResult.data;
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const session: InterviewSession = {
      id,
      candidateName,
      role,
      type,
      durationMinutes,
      status: 'CREATED',
      currentStage: 'INTRO',
      createdAt: new Date().toISOString(),
    };

    this.sessions.set(id, session);
    return session;
  }

  public getSession(id: string): InterviewSession {
    const session = this.sessions.get(id);
    if (!session) {
      throw new NotFoundException(`Interview session with ID '${id}' was not found`);
    }
    return session;
  }

  public startSession(id: string): InterviewSession {
    const session = this.getSession(id);

    if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot start interview session with status '${session.status}'`,
      );
    }

    if (session.status === 'IN_PROGRESS') {
      return session;
    }

    session.status = 'IN_PROGRESS';
    session.currentStage = 'TECHNICAL';
    if (!session.startedAt) {
      session.startedAt = new Date().toISOString();
    }

    this.sessions.set(id, session);
    return session;
  }

  public endSession(id: string): InterviewSession {
    const session = this.getSession(id);

    if (session.status === 'COMPLETED') {
      return session;
    }

    if (session.status === 'CANCELLED') {
      throw new BadRequestException('Cannot end a cancelled interview session');
    }

    session.status = 'COMPLETED';
    session.currentStage = 'COMPLETION';
    session.completedAt = new Date().toISOString();

    this.sessions.set(id, session);
    return session;
  }
}
