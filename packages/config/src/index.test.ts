import { describe, it, expect } from 'vitest';
import { getValidatedEnv } from './index';

describe('Config Package Validation', () => {
  it('should validate default environment variables', () => {
    const env = getValidatedEnv({});
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3000);
    expect(env.API_PORT).toBe(3001);
    expect(env.DATABASE_URL).toContain('postgresql://');
    expect(env.VALKEY_URL).toContain('redis://');
  });

  it('should accept custom environment overrides', () => {
    const env = getValidatedEnv({
      NODE_ENV: 'test',
      PORT: '8080',
      API_PORT: '8081',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/mydb',
      VALKEY_URL: 'redis://localhost:6380',
    });
    expect(env.NODE_ENV).toBe('test');
    expect(env.PORT).toBe(8080);
    expect(env.API_PORT).toBe(8081);
    expect(env.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/mydb');
  });
});
