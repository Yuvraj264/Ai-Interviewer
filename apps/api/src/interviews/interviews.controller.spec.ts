import { describe, it, expect, beforeEach } from 'vitest';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InterviewsController REST Endpoints', () => {
  let controller: InterviewsController;
  let service: InterviewsService;

  beforeEach(() => {
    service = new InterviewsService();
    controller = new InterviewsController(service);
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

  it('should transition session status from CREATED to IN_PROGRESS and COMPLETED', () => {
    const createRes = controller.createSession({
      candidateName: 'Charlie',
      role: 'Frontend Dev',
      type: 'mixed',
      durationMinutes: 30,
    });
    const sessionId = createRes.data!.session.id;

    const startRes = controller.startSession(sessionId);
    expect(startRes.data?.session.status).toBe('IN_PROGRESS');
    expect(startRes.data?.session.startedAt).toBeDefined();

    const endRes = controller.endSession(sessionId);
    expect(endRes.data?.session.status).toBe('COMPLETED');
    expect(endRes.data?.session.completedAt).toBeDefined();
  });
});
