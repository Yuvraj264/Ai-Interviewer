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
var import_config = require("@ai-interviewer/config");
var import_shared = require("@ai-interviewer/shared");
var AgentWorker = class {
  isRunning = false;
  activeRooms = /* @__PURE__ */ new Map();
  async start() {
    const env = (0, import_config.getValidatedEnv)();
    this.isRunning = true;
    console.log(`[Agent Worker] Initialized in ${env.NODE_ENV} mode.`);
    console.log(`[Agent Worker] Phase: ${import_shared.PROJECT_PHASE}`);
    console.log(`[Agent Worker] LiveKit URL: ${env.LIVEKIT_URL}`);
  }
  async joinRoom(sessionId) {
    if (!this.isRunning) {
      throw new Error("AgentWorker must be started before joining rooms.");
    }
    const roomName = `interview:${sessionId}`;
    const agentIdentity = `agent-${sessionId}`;
    const sessionData = {
      sessionId,
      roomName,
      agentIdentity,
      connectedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.activeRooms.set(sessionId, sessionData);
    console.log(`[Agent Worker] [realtime.agent.joined] Room: ${roomName}, Identity: ${agentIdentity}`);
    return sessionData;
  }
  async leaveRoom(sessionId) {
    const room = this.activeRooms.get(sessionId);
    if (room) {
      this.activeRooms.delete(sessionId);
      console.log(`[Agent Worker] [realtime.agent.left] Room: ${room.roomName}, Identity: ${room.agentIdentity}`);
    }
  }
  getStatus() {
    const isLiveKitConfigured = Boolean(process.env.LIVEKIT_URL || "ws://localhost:7880");
    return {
      health: {
        status: this.isRunning ? "ok" : "down",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        service: "agent-worker"
      },
      livekitConnected: this.isRunning && isLiveKitConfigured,
      activeSessions: this.activeRooms.size,
      activeRooms: Array.from(this.activeRooms.values())
    };
  }
  async stop() {
    this.activeRooms.clear();
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
