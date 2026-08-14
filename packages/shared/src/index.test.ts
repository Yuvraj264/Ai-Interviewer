import { describe, it, expect } from 'vitest';
import { PROJECT_PHASE, AiConversationState, TranscriptItem } from './index';

describe('Shared Package Phase 4 Contracts', () => {
  it('should export current Phase 4 project phase constant', () => {
    expect(PROJECT_PHASE).toBe('Phase 4 — First End-to-End Voice Interview');
  });

  it('should support valid AiConversationState values', () => {
    const states: AiConversationState[] = [
      'IDLE',
      'CONNECTING',
      'LISTENING',
      'THINKING',
      'SPEAKING',
      'INTERRUPTED',
      'RECONNECTING',
      'ERROR',
      'ENDING',
    ];
    expect(states.length).toBe(9);
  });

  it('should validate TranscriptItem shape', () => {
    const item: TranscriptItem = {
      id: 'tx_123',
      speaker: 'ai',
      text: 'Tell me about yourself.',
      timestamp: new Date().toISOString(),
    };
    expect(item.speaker).toBe('ai');
    expect(item.text).toContain('yourself');
  });
});
