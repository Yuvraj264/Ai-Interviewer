import { describe, it, expect } from 'vitest';
import { getValidatedEnv } from './index';

describe('Config Package Validation', () => {
  it('should validate default environment variables including LiveKit configuration', () => {
    const env = getValidatedEnv({});
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
    expect(env.API_PORT).toBe(3001);
    expect(env.DATABASE_URL).toContain('postgresql://');
    expect(env.VALKEY_URL).toContain('redis://');
    expect(env.LIVEKIT_URL).toBe('ws://localhost:7880');
    expect(env.LIVEKIT_API_KEY).toBe('devkey');
    expect(env.LIVEKIT_API_SECRET).toBe('secret');
  });

  it('should accept custom environment overrides for LiveKit', () => {
    const env = getValidatedEnv({
      NODE_ENV: 'test',
      LIVEKIT_URL: 'wss://my-livekit.example.com',
      LIVEKIT_API_KEY: 'custom-key',
      LIVEKIT_API_SECRET: 'custom-secret',
    });
    expect(env.LIVEKIT_URL).toBe('wss://my-livekit.example.com');
    expect(env.LIVEKIT_API_KEY).toBe('custom-key');
    expect(env.LIVEKIT_API_SECRET).toBe('custom-secret');
  });
});
