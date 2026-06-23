import path from "node:path";

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const monorepoRoot = path.resolve(import.meta.dirname, "../..");

config({ path: path.resolve(monorepoRoot, ".env") });
config({ path: path.resolve(monorepoRoot, ".env.local") });
config({ override: true, path: path.resolve(monorepoRoot, "apps/web/.env") });

export default defineConfig({
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/schema/index.ts",
});
