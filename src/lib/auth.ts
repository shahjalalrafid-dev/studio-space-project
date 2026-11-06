import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

/**
 * The Better Auth instance behind `/api/auth/[...all]`.
 *
 * Design notes for deployment (Vercel):
 *  · the MongoDB client is created lazily and cached on `globalThis`, so a
 *    dev hot-reload (or a second lambda) never pools a new connection each time;
 *  · a missing `MONGO_DB_URL` must NOT throw at import time — that would fail
 *    `next build` on a fresh environment before any env var is configured.
 *    Instead the instance is built without a database and every auth call
 *    fails at request time with the standard "Database not specified" error,
 *    while `src/lib/mongo.ts` reports the missing variable on the data routes.
 */

const DATABASE_NAME = "studio-space";

declare global {
  var __studioSpaceAuthMongo: MongoClient | undefined;
}

function createAuth() {
  const baseOptions = {
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google", "github"],
      },
    },
    emailAndPassword: {
      enabled: true,
      // Matches the registration form's password policy (min 6 characters).
      minPasswordLength: 6,
      // No email verification on purpose — the assignment asks for it to be skipped.
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      },
    },
  };

  const mongoUrl = process.env.MONGO_DB_URL?.trim();

  if (!mongoUrl) {
    console.warn(
      "[auth] MONGO_DB_URL is missing — sessions can't be read until it is set.",
    );
    return betterAuth(baseOptions);
  }

  if (!globalThis.__studioSpaceAuthMongo) {
    globalThis.__studioSpaceAuthMongo = new MongoClient(mongoUrl, {
      maxPoolSize: 6,
      serverSelectionTimeoutMS: 8000,
    });
  }

  const client = globalThis.__studioSpaceAuthMongo;
  const db = client.db(DATABASE_NAME);

  return betterAuth({
    ...baseOptions,
    database: mongodbAdapter(db, { client }),
  });
}

export const auth = createAuth();
