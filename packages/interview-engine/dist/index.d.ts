/**
 * Interview Engine Foundation Placeholder
 * Reserved for future interview state machine and decision logic (Phase 3/4).
 */
interface InterviewEngineOptions {
    engineVersion: string;
}
declare const INTERVIEW_ENGINE_VERSION = "0.1.0-alpha";
declare function getEngineStatus(): {
    ready: boolean;
    version: string;
};

export { INTERVIEW_ENGINE_VERSION, type InterviewEngineOptions, getEngineStatus };
