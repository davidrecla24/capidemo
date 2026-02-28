import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./workers/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
});
