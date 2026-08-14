import { Injectable, BadRequestException } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { getValidatedEnv } from '@ai-interviewer/config';
import { InterviewsService } from './interviews.service';
import { RealtimeTokenResponse } from '@ai-interviewer/shared';

@Injectable()
export class RealtimeService {
  constructor(private readonly interviewsService: InterviewsService) {}

  public async generateCandidateToken(sessionId: string): Promise<RealtimeTokenResponse> {
    const session = this.interviewsService.getSession(sessionId);

    if (session.status === 'COMPLETED' || session.status === 'CANCELLED') {
      throw new BadRequestException(
        `Cannot issue realtime token for interview session in state '${session.status}'`,
      );
    }

    const env = getValidatedEnv();
    const roomName = `interview:${session.id}`;
    const participantIdentity = `candidate-${session.id}`;

    const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
      identity: participantIdentity,
      name: session.candidateName,
      ttl: '30m',
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return {
      token,
      url: env.LIVEKIT_URL,
      roomName,
      participantIdentity,
    };
  }
}
