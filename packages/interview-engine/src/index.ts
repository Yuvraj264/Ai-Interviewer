/**
 * Interview Engine Foundation Placeholder
 * Reserved for future interview state machine and decision logic (Phase 3/4).
 */

export interface InterviewEngineOptions {
  engineVersion: string;
}

export const INTERVIEW_ENGINE_VERSION = '0.1.0-alpha';

export function getEngineStatus(): { ready: boolean; version: string } {
  return {
    ready: false,
    version: INTERVIEW_ENGINE_VERSION,
  };
}
