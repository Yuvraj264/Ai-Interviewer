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
  async start() {
    const env = (0, import_config.getValidatedEnv)();
    this.isRunning = true;
    console.log(`[Agent Worker Shell] Initialized in ${env.NODE_ENV} mode.`);
    console.log(`[Agent Worker Shell] Phase: ${import_shared.PROJECT_PHASE}`);
    console.log(`[Agent Worker Shell] LiveKit connection disabled in Phase 1.`);
  }
  getStatus() {
    return {
      health: {
        status: this.isRunning ? "ok" : "down",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        service: "agent-worker"
      },
      livekitConnected: false,
      activeSessions: 0
    };
  }
  async stop() {
    this.isRunning = false;
    console.log("[Agent Worker Shell] Stopped worker process.");
  }
};
if (require.main === module) {
  const worker = new AgentWorker();
  worker.start().catch((err) => {
    console.error("[Agent Worker Shell] Error during start:", err);
    process.exit(1);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentWorker
});
