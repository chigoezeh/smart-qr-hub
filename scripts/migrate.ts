import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db";
import { sql } from "drizzle-orm";

async function runMigration() {
  console.log("🚀 Running database migrations...");

  try {
    // Run the migrations from the drizzle directory
    await migrate(db, { migrationsFolder: "drizzle" });
    
    console.log("✅ Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
