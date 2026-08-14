import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, RealtimeTokenResponse, RealtimeConnectionState } from './index';

describe('Shared Package Phase 3 Contracts', () => {
  it('should export current Phase 3 project phase constant', () => {
    expect(PROJECT_PHASE).toBe('Phase 3 — Realtime Audio Foundation');
  });

  it('should validate RealtimeTokenResponse interface contract', () => {
    const res: RealtimeTokenResponse = {
      token: 'jwt.token.string',
      url: 'ws://localhost:7880',
      roomName: 'interview:sess_12345',
      participantIdentity: 'candidate-sess_12345',
    };
    expect(res.roomName).toBe('interview:sess_12345');
    expect(res.participantIdentity).toBe('candidate-sess_12345');
  });

  it('should support explicit RealtimeConnectionState values', () => {
    const states: RealtimeConnectionState[] = [
      'DISCONNECTED',
      'CONNECTING',
      'CONNECTED',
      'RECONNECTING',
      'FAILED',
    ];
    expect(states.length).toBe(5);
  });
});
