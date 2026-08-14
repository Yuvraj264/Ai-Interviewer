// src/index.ts
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3e3),
  API_PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/ai_interviewer_dev"),
  VALKEY_URL: z.string().default("redis://localhost:6379"),
  LIVEKIT_URL: z.string().default("ws://localhost:7880"),
  LIVEKIT_API_KEY: z.string().default("devkey"),
  LIVEKIT_API_SECRET: z.string().default("secret")
});
function getValidatedEnv(env = process.env) {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error("Invalid environment variables:", result.error.flatten().fieldErrors);
    throw new Error("Environment variable validation failed");
  }
  return result.data;
}
export {
  envSchema,
  getValidatedEnv
};
