import { describe, it, expect, beforeEach } from 'vitest';
import { InterviewsService } from './interviews.service';
import { RealtimeService } from './realtime.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RealtimeService Token Authorization', () => {
  let interviewsService: InterviewsService;
  let realtimeService: RealtimeService;

  beforeEach(() => {
    interviewsService = new InterviewsService();
    realtimeService = new RealtimeService(interviewsService);
  });

  it('should generate valid LiveKit token for active session', async () => {
    const session = interviewsService.createSession({
      candidateName: 'David Miller',
      role: 'Staff Engineer',
      type: 'technical',
      durationMinutes: 20,
    });

    const res = await realtimeService.generateCandidateToken(session.id);
    expect(res.token).toBeDefined();
    expect(typeof res.token).toBe('string');
    expect(res.roomName).toBe(`interview:${session.id}`);
    expect(res.participantIdentity).toBe(`candidate-${session.id}`);
    expect(res.url).toBeDefined();
  });

  it('should throw NotFoundException for non-existent session ID', async () => {
    await expect(realtimeService.generateCandidateToken('invalid_session_id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw BadRequestException for completed session', async () => {
    const session = interviewsService.createSession({
      candidateName: 'Eve',
      role: 'DevOps Lead',
      type: 'behavioral',
      durationMinutes: 10,
    });
    interviewsService.endSession(session.id);

    await expect(realtimeService.generateCandidateToken(session.id)).rejects.toThrow(
      BadRequestException,
    );
  });
});
