import { describe, it, expect } from 'vitest';
import { getEngineStatus, INTERVIEW_ENGINE_VERSION } from './index';

describe('Interview Engine Foundation', () => {
  it('should return engine status shell info', () => {
    const status = getEngineStatus();
    expect(status.version).toBe(INTERVIEW_ENGINE_VERSION);
    expect(status.ready).toBe(false);
  });
});
