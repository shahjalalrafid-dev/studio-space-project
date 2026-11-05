
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.MONGO_DB_URL;

if (!mongoUrl) {
  throw new Error(
    "MONGO_DB_URL is missing from the deployment environment."
  );
}

const client = new MongoClient(mongoUrl);
const db = client.db("studio-space");

export const auth = betterAuth({
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"], // Add your provider IDs here (e.g., "google", "github", etc.)
    },
  },
  emailAndPassword: {
    enabled: true,
    // Matches the registration form's password policy (min 6 characters).
    minPasswordLength: 6,
    // No email verification on purpose — the assignment asks for it to be skipped.
    requireEmailVerification: false,
  },
  database: mongodbAdapter(db, {
    client,
  }),
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
});
