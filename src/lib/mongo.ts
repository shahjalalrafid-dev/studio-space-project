import { Db, MongoClient } from "mongodb";

/**
 * One MongoDB connection for the whole server.
 *
 * The client is cached on `globalThis` so Next.js dev hot-reloads never
 * leak a new connection pool per rebuild, and it is created lazily so
 * importing this module (e.g. while prerendering) cannot throw before
 * `MONGO_DB_URL` is read.
 */

const DATABASE_NAME = "studio-space";

declare global {
  var __studioSpaceMongo: MongoClient | undefined;
}

export function getDb(): Db {
  const uri = process.env.MONGO_DB_URL;

  if (!uri) {
    throw new Error(
      "MONGO_DB_URL is missing from the environment — add it to .env to read studios from MongoDB.",
    );
  }

  if (!globalThis.__studioSpaceMongo) {
    globalThis.__studioSpaceMongo = new MongoClient(uri, {
      maxPoolSize: 6,
      serverSelectionTimeoutMS: 8000,
    });
  }

  return globalThis.__studioSpaceMongo.db(DATABASE_NAME);
}
