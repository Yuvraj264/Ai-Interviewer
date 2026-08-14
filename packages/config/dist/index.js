"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  envSchema: () => envSchema,
  getValidatedEnv: () => getValidatedEnv
});
module.exports = __toCommonJS(index_exports);
var import_zod = require("zod");
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: import_zod.z.coerce.number().default(3e3),
  API_PORT: import_zod.z.coerce.number().default(3001),
  DATABASE_URL: import_zod.z.string().default("postgresql://postgres:postgres@localhost:5432/ai_interviewer_dev"),
  VALKEY_URL: import_zod.z.string().default("redis://localhost:6379"),
  LIVEKIT_URL: import_zod.z.string().default("ws://localhost:7880"),
  LIVEKIT_API_KEY: import_zod.z.string().default("devkey"),
  LIVEKIT_API_SECRET: import_zod.z.string().default("secret"),
  OPENAI_API_KEY: import_zod.z.string().default(""),
  OPENAI_REALTIME_MODEL: import_zod.z.string().default("gpt-4o-realtime-preview"),
  OPENAI_REALTIME_VOICE: import_zod.z.string().default("alloy")
});
function getValidatedEnv(env = process.env) {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Environment variable validation failed");
  }
  const parsed = result.data;
  if (parsed.NODE_ENV === "production") {
    const missing = [];
    if (!parsed.DATABASE_URL || parsed.DATABASE_URL.includes("localhost")) missing.push("DATABASE_URL");
    if (!parsed.LIVEKIT_API_KEY || parsed.LIVEKIT_API_KEY === "devkey") missing.push("LIVEKIT_API_KEY");
    if (!parsed.LIVEKIT_API_SECRET || parsed.LIVEKIT_API_SECRET === "secret") missing.push("LIVEKIT_API_SECRET");
    if (!parsed.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
    if (missing.length > 0) {
      const msg = `[Production Hardening] Critical startup check failed: Missing or default credentials for [${missing.join(", ")}] in production environment.`;
      console.error(msg);
      throw new Error(msg);
    }
  }
  return parsed;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  envSchema,
  getValidatedEnv
});
