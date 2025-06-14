import z from "zod/v4";
import { generateErrorMessage } from "zod-error";

export const serverEnvSchema = z.object({
  DATABASE_PRISMA_URL: z.string(),
  SECURE_AUTH_COOKIE: z.enum(["true", "false"]).transform((v) => v === "true"),
  NODE_ENV: z.enum(["development", "test", "production"]),
  SECRET_KEY_BASE: z.string(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Zod will filter all the keys not specified on the schema */
function buildEnv(): ServerEnv {
  try {
    return serverEnvSchema.parse(process.env);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Warning: invalid server env vars!");
    console.error(
      generateErrorMessage(error.issues, {
        delimiter: { error: "\n" },
      }),
    );

    return {} as ServerEnv;
  }
}

export const SERVER_ENV = buildEnv();
