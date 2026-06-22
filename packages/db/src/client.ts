import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

const globalForDb = globalThis as typeof globalThis & {
  postgresClient?: ReturnType<typeof postgres>;
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>;
};

function getClient() {
  if (!globalForDb.postgresClient) {
    globalForDb.postgresClient = postgres(getDatabaseUrl(), {
      idle_timeout: 20,
      max: 10,
    });
  }
  return globalForDb.postgresClient;
}

export function createDb() {
  return drizzle(getClient(), { schema });
}

export function getDb() {
  if (!globalForDb.drizzleDb) {
    globalForDb.drizzleDb = createDb();
  }
  return globalForDb.drizzleDb;
}

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

export { schema };
