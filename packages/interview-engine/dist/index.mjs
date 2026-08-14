// src/index.ts
var INTERVIEW_ENGINE_VERSION = "0.1.0-alpha";
function getEngineStatus() {
  return {
    ready: false,
    version: INTERVIEW_ENGINE_VERSION
  };
}
export {
  INTERVIEW_ENGINE_VERSION,
  getEngineStatus
};
