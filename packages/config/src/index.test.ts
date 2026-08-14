import { describe, it, expect } from 'vitest';
import { getValidatedEnv } from './index';

describe('Config Package Validation', () => {
  it('should validate default environment variables including LiveKit and OpenAI configuration', () => {
    const env = getValidatedEnv({});
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
    expect(env.API_PORT).toBe(3001);
    expect(env.DATABASE_URL).toContain('postgresql://');
    expect(env.VALKEY_URL).toContain('redis://');
    expect(env.LIVEKIT_URL).toBe('ws://localhost:7880');
    expect(env.LIVEKIT_API_KEY).toBe('devkey');
    expect(env.LIVEKIT_API_SECRET).toBe('secret');
    expect(env.OPENAI_REALTIME_MODEL).toBe('gpt-4o-realtime-preview');
    expect(env.OPENAI_REALTIME_VOICE).toBe('alloy');
  });

  it('should accept custom environment overrides for OpenAI Realtime', () => {
    const env = getValidatedEnv({
      NODE_ENV: 'test',
      OPENAI_API_KEY: 'sk-test-key-12345',
      OPENAI_REALTIME_MODEL: 'gpt-4o-realtime-preview-custom',
      OPENAI_REALTIME_VOICE: 'echo',
    });
    expect(env.OPENAI_API_KEY).toBe('sk-test-key-12345');
    expect(env.OPENAI_REALTIME_MODEL).toBe('gpt-4o-realtime-preview-custom');
    expect(env.OPENAI_REALTIME_VOICE).toBe('echo');
  });
});
