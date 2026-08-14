"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AgentWorker: () => AgentWorker
});
module.exports = __toCommonJS(index_exports);
var import_config2 = require("@ai-interviewer/config");
var import_shared = require("@ai-interviewer/shared");

// src/realtime-session.ts
var import_config = require("@ai-interviewer/config");
var import_interview_engine = require("@ai-interviewer/interview-engine");
var RealtimeVoiceSession = class {
  sessionId;
  roomName;
  agentIdentity;
  conversationState = "IDLE";
  transcript = [];
  telemetry = {};
  activeGreeting;
  constructor(sessionId, promptContext) {
    this.sessionId = sessionId;
    this.roomName = `interview:${sessionId}`;
    this.agentIdentity = `agent-${sessionId}`;
    const instructions = (0, import_interview_engine.buildInterviewerInstructions)(promptContext);
    const candidateName = promptContext?.candidateName || "Candidate";
    const role = promptContext?.role || "Software Engineer";
    this.activeGreeting = `Hi ${candidateName}, welcome to your interview for the ${role} position. I'm your AI interviewer today. To get started, could you briefly introduce yourself?`;
    const env = (0, import_config.getValidatedEnv)();
    if (!env.OPENAI_API_KEY) {
      console.warn(`[Realtime Voice Session ${sessionId}] Warning: OPENAI_API_KEY is not configured. Running in simulated voice agent mode.`);
    }
    console.log(`[Realtime Voice Session ${sessionId}] Configured OpenAI Model: ${env.OPENAI_REALTIME_MODEL}, Voice: ${env.OPENAI_REALTIME_VOICE}`);
    console.log(`[Realtime Voice Session ${sessionId}] Instructions length: ${instructions.length} chars`);
  }
  async startSession() {
    this.conversationState = "CONNECTING";
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.started] Connecting to room ${this.roomName}...`);
    this.conversationState = "THINKING";
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.ready] Generating initial greeting...`);
    await this.speak(this.activeGreeting);
  }
  async speak(text) {
    this.conversationState = "SPEAKING";
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    if (this.telemetry.candidateTurnEndTimestamp && !this.telemetry.firstAiAudioTimestamp) {
      this.telemetry.firstAiAudioTimestamp = Date.now();
      this.telemetry.timeToFirstAudioMs = this.telemetry.firstAiAudioTimestamp - this.telemetry.candidateTurnEndTimestamp;
      console.log(`[Realtime Voice Session ${this.sessionId}] [telemetry.latency] time_to_first_audio: ${this.telemetry.timeToFirstAudioMs} ms`);
    }
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.response.started] AI Speaking: "${text}"`);
    this.transcript.push({
      id: `tx_ai_${Date.now()}`,
      speaker: "ai",
      text,
      timestamp
    });
    this.conversationState = "LISTENING";
  }
  handleCandidateTurnStarted() {
    if (this.conversationState === "SPEAKING") {
      console.log(`[Realtime Voice Session ${this.sessionId}] [ai.response.interrupted] Candidate interrupted AI speech.`);
      this.conversationState = "INTERRUPTED";
    }
  }
  handleCandidateTurnCompleted(candidateText) {
    this.telemetry.candidateTurnEndTimestamp = Date.now();
    this.telemetry.firstAiAudioTimestamp = void 0;
    this.telemetry.timeToFirstAudioMs = void 0;
    console.log(`[Realtime Voice Session ${this.sessionId}] [candidate.turn.completed] Candidate: "${candidateText}"`);
    this.transcript.push({
      id: `tx_candidate_${Date.now()}`,
      speaker: "candidate",
      text: candidateText,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.conversationState = "THINKING";
  }
  getState() {
    return this.conversationState;
  }
  getTranscript() {
    return [...this.transcript];
  }
  getTelemetry() {
    return { ...this.telemetry };
  }
  async stopSession() {
    this.conversationState = "ENDING";
    console.log(`[Realtime Voice Session ${this.sessionId}] [ai.session.ended] Session stopped cleanly.`);
    this.conversationState = "IDLE";
  }
};

// src/index.ts
var AgentWorker = class {
  isRunning = false;
  activeRooms = /* @__PURE__ */ new Map();
  async start() {
    const env = (0, import_config2.getValidatedEnv)();
    this.isRunning = true;
    console.log(`[Agent Worker] Initialized in ${env.NODE_ENV} mode.`);
    console.log(`[Agent Worker] Phase: ${import_shared.PROJECT_PHASE}`);
    console.log(`[Agent Worker] LiveKit URL: ${env.LIVEKIT_URL}`);
    console.log(`[Agent Worker] OpenAI Model: ${env.OPENAI_REALTIME_MODEL}, Voice: ${env.OPENAI_REALTIME_VOICE}`);
  }
  async joinRoom(sessionId, context) {
    if (!this.isRunning) {
      throw new Error("AgentWorker must be started before joining rooms.");
    }
    const roomName = `interview:${sessionId}`;
    const agentIdentity = `agent-${sessionId}`;
    const realtimeSession = new RealtimeVoiceSession(sessionId, context);
    await realtimeSession.startSession();
    const sessionData = {
      sessionId,
      roomName,
      agentIdentity,
      connectedAt: (/* @__PURE__ */ new Date()).toISOString(),
      sessionInstance: realtimeSession
    };
    this.activeRooms.set(sessionId, sessionData);
    console.log(`[Agent Worker] [realtime.agent.joined] Room: ${roomName}, Identity: ${agentIdentity}`);
    return sessionData;
  }
  getSession(sessionId) {
    return this.activeRooms.get(sessionId)?.sessionInstance;
  }
  async leaveRoom(sessionId) {
    const room = this.activeRooms.get(sessionId);
    if (room) {
      if (room.sessionInstance) {
        await room.sessionInstance.stopSession();
      }
      this.activeRooms.delete(sessionId);
      console.log(`[Agent Worker] [realtime.agent.left] Room: ${room.roomName}, Identity: ${room.agentIdentity}`);
    }
  }
  getStatus() {
    const env = (0, import_config2.getValidatedEnv)();
    const isLiveKitConfigured = Boolean(env.LIVEKIT_URL);
    const isOpenAiConfigured = Boolean(env.OPENAI_REALTIME_MODEL);
    return {
      health: {
        status: this.isRunning ? "ok" : "down",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
        service: "agent-worker"
      },
      livekitConnected: this.isRunning && isLiveKitConfigured,
      openaiConfigured: isOpenAiConfigured,
      activeSessions: this.activeRooms.size,
      activeRooms: Array.from(this.activeRooms.values()).map(({ sessionInstance: _, ...rest }) => rest)
    };
  }
  async stop() {
    for (const sessionId of Array.from(this.activeRooms.keys())) {
      await this.leaveRoom(sessionId);
    }
    this.isRunning = false;
    console.log("[Agent Worker] Stopped worker process.");
  }
};
if (require.main === module) {
  const worker = new AgentWorker();
  worker.start().catch((err) => {
    console.error("[Agent Worker] Error during start:", err);
    process.exit(1);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentWorker
});
