import { z } from 'zod';

declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "test", "production"]>>;
    PORT: z.ZodDefault<z.ZodNumber>;
    API_PORT: z.ZodDefault<z.ZodNumber>;
    DATABASE_URL: z.ZodDefault<z.ZodString>;
    VALKEY_URL: z.ZodDefault<z.ZodString>;
    LIVEKIT_URL: z.ZodDefault<z.ZodString>;
    LIVEKIT_API_KEY: z.ZodDefault<z.ZodString>;
    LIVEKIT_API_SECRET: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "test" | "production";
    PORT: number;
    API_PORT: number;
    DATABASE_URL: string;
    VALKEY_URL: string;
    LIVEKIT_URL: string;
    LIVEKIT_API_KEY: string;
    LIVEKIT_API_SECRET: string;
}, {
    NODE_ENV?: "development" | "test" | "production" | undefined;
    PORT?: number | undefined;
    API_PORT?: number | undefined;
    DATABASE_URL?: string | undefined;
    VALKEY_URL?: string | undefined;
    LIVEKIT_URL?: string | undefined;
    LIVEKIT_API_KEY?: string | undefined;
    LIVEKIT_API_SECRET?: string | undefined;
}>;
type Env = z.infer<typeof envSchema>;
declare function getValidatedEnv(env?: NodeJS.ProcessEnv): Env;

export { type Env, envSchema, getValidatedEnv };
