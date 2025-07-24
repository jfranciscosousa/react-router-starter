/* eslint-disable @typescript-eslint/no-explicit-any */
import Prisma from "@prisma/client";

import { SERVER_ENV } from "~/env/envFlags.server";
import { UserFeatureFlagsSchema } from "../../env/userFeatureFlags.server";

function buildClient() {
  const client = new Prisma.PrismaClient({
    log: ["query", "info", "warn", "error"],
  })
    /**
     * This extension applies the `zod` schema defined above to the user feature flags.
     *
     * It also makes it fully type safe even at runtime!
     */
    .$extends({
      result: {
        user: {
          featureFlags: {
            needs: { featureFlags: true },
            compute({ featureFlags }) {
              return UserFeatureFlagsSchema.parse(featureFlags);
            },
          },
        },
      },

      query: {
        user: {
          create({ args, query }) {
            args.data.featureFlags = UserFeatureFlagsSchema.parse(
              args.data.featureFlags,
            );
            return query(args);
          },
          createMany({ args, query }) {
            const users = Array.isArray(args.data) ? args.data : [args.data];
            for (const user of users) {
              user.featureFlags = UserFeatureFlagsSchema.parse(
                user.featureFlags,
              );
            }
            return query(args);
          },
          update({ args, query }) {
            if (args.data.featureFlags !== undefined) {
              args.data.featureFlags = UserFeatureFlagsSchema.parse(
                args.data.featureFlags,
              );
            }
            return query(args);
          },
          updateMany({ args, query }) {
            if (args.data.featureFlags !== undefined) {
              args.data.featureFlags = UserFeatureFlagsSchema.parse(
                args.data.featureFlags,
              );
            }
            return query(args);
          },
          upsert({ args, query }) {
            args.create.featureFlags = UserFeatureFlagsSchema.parse(
              args.create.featureFlags,
            );
            if (args.update.featureFlags !== undefined) {
              args.update.featureFlags = UserFeatureFlagsSchema.parse(
                args.update.featureFlags,
              );
            }
            return query(args);
          },
        },
      },
    });

  return client;
}

/**
 * The type of the PrismaClient with extensions
 */
export type PrismaClientType = ReturnType<typeof buildClient>;

let prisma: PrismaClientType;

declare global {
  let __prisma: PrismaClientType | undefined;
}

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (SERVER_ENV.NODE_ENV === "production") {
  prisma = buildClient();
  prisma.$connect();
} else {
  if (!(global as any).__prisma) {
    (global as any).__prisma = buildClient();
    (global as any).__prisma.$connect();
  }
  prisma = (global as any).__prisma;
}

export default prisma;
