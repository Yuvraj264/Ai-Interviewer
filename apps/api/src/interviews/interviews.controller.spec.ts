import { describe, it, expect, beforeEach } from 'vitest';
import { InterviewsService } from './interviews.service';
import { RealtimeService } from './realtime.service';
import { InterviewsController } from './interviews.controller';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateSessionDto } from '@ai-interviewer/shared';

describe('InterviewsController REST Endpoints', () => {
  let controller: InterviewsController;
  let service: InterviewsService;
  let realtimeService: RealtimeService;

  beforeEach(() => {
    service = new InterviewsService();
    realtimeService = new RealtimeService(service);
    controller = new InterviewsController(service, realtimeService);
  });

  it('should create an interview session with valid payload', () => {
    const res = controller.createSession({
      candidateName: 'Alice Smith',
      role: 'Staff Engineer',
      type: 'technical',
      durationMinutes: 20,
    });

    expect(res.success).toBe(true);
    expect(res.data?.session.id).toBeDefined();
    expect(res.data?.session.status).toBe('CREATED');
    expect(res.data?.session.candidateName).toBe('Alice Smith');
  });

  it('should throw BadRequestException when creating session with invalid payload', () => {
    expect(() =>
      controller.createSession({
        candidateName: 'A',
        role: '',
        type: 'invalid' as unknown as CreateSessionDto['type'],
        durationMinutes: 99 as unknown as CreateSessionDto['durationMinutes'],
      }),
    ).toThrow(BadRequestException);
  });

  it('should retrieve existing session by ID', () => {
    const createRes = controller.createSession({
      candidateName: 'Bob',
      role: 'DevOps Lead',
      type: 'behavioral',
      durationMinutes: 10,
    });
    const sessionId = createRes.data!.session.id;

    const getRes = controller.getSession(sessionId);
    expect(getRes.success).toBe(true);
    expect(getRes.data?.session.id).toBe(sessionId);
  });

  it('should throw NotFoundException for unknown session ID', () => {
    expect(() => controller.getSession('non_existent_id')).toThrow(NotFoundException);
  });

  it('should generate realtime token via controller endpoint', async () => {
    const createRes = controller.createSession({
      candidateName: 'David',
      role: 'Frontend Dev',
      type: 'mixed',
      durationMinutes: 20,
    });
    const sessionId = createRes.data!.session.id;

    const tokenRes = await controller.getRealtimeToken(sessionId);
    expect(tokenRes.success).toBe(true);
    expect(tokenRes.data?.token).toBeDefined();
    expect(tokenRes.data?.roomName).toBe(`interview:${sessionId}`);
  });
});
