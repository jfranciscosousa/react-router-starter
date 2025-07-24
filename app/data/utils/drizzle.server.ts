/* eslint-disable @typescript-eslint/no-explicit-any */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { SERVER_ENV } from "~/env/envFlags.server";
import { UserFeatureFlagsSchema } from "~/env/userFeatureFlags.server";
import * as schema from "../schema";

let pool: Pool;
let db: ReturnType<typeof drizzle<typeof schema>>;

function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
declare global {
  let __drizzle_pool: Pool | undefined;
  let __drizzle_db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

if (SERVER_ENV.NODE_ENV === "production") {
  pool = createPool();
  db = drizzle(pool, {
    schema,
    logger: false,
  });
} else {
  if (!(global as any).__drizzle_pool) {
    (global as any).__drizzle_pool = createPool();
    (global as any).__drizzle_db = drizzle((global as any).__drizzle_pool, {
      schema,
      logger: true,
    });
  }
  pool = (global as any).__drizzle_pool;
  db = (global as any).__drizzle_db!;
}

// Helper function to parse and validate feature flags
export function parseFeatureFlags(featureFlags: unknown) {
  try {
    return UserFeatureFlagsSchema.parse(featureFlags);
  } catch (error) {
    console.error("Invalid feature flags:", error);
    return UserFeatureFlagsSchema.parse({});
  }
}

export { db, pool };
export default db;
