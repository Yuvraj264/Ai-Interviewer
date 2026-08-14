// src/index.ts
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: z.coerce.number().default(3e3),
  API_PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/ai_interviewer_dev"),
  VALKEY_URL: z.string().default("redis://localhost:6379"),
  LIVEKIT_URL: z.string().default("ws://localhost:7880"),
  LIVEKIT_API_KEY: z.string().default("devkey"),
  LIVEKIT_API_SECRET: z.string().default("secret"),
  OPENAI_API_KEY: z.string().default(""),
  OPENAI_REALTIME_MODEL: z.string().default("gpt-4o-realtime-preview"),
  OPENAI_REALTIME_VOICE: z.string().default("alloy")
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
export {
  envSchema,
  getValidatedEnv
};
