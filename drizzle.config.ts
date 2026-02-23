import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Force Drizzle to read your local environment variables
config({ path: ".env.local" }); 

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});