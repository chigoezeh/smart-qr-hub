import { db } from "../db";
import { sql } from "drizzle-orm";
import { workspaces, workspaceMembers } from "../db/schema";
import "dotenv/config";

/**
 * Migration script to handle existing data
 * This script should be run BEFORE applying the main migration if you have existing data
 */
async function migrateExistingData() {
  console.log("🔄 Checking for existing data...");

  try {
    // Check if qr_codes table exists with old schema
    const existingCodesCheck = await db.execute(
      sql`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'qr_codes'
      )`
    );

    const tableExists = existingCodesCheck.rows[0]?.exists;

    if (!tableExists) {
      console.log("✅ No existing data found. You can run the migration normally.");
      console.log("Run: npx drizzle-kit migrate");
      process.exit(0);
    }

    // Check if workspace_id column already exists
    const workspaceIdCheck = await db.execute(
      sql`SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'qr_codes' 
        AND column_name = 'workspace_id'
      )`
    );

    if (workspaceIdCheck.rows[0]?.exists) {
      console.log("✅ Migration already applied!");
      process.exit(0);
    }

    console.log("📦 Found existing QR codes table. Preparing migration...");
    console.log("⚠️  WARNING: This will modify your database schema.");
    console.log("⚠️  Make sure you have a backup!");
    console.log("");
    console.log("Migration steps:");
    console.log("1. Create new tables (workspaces, workspace_members, etc.)");
    console.log("2. Create default workspace");
    console.log("3. Add workspace_id column to qr_codes");
    console.log("4. Backfill existing QR codes with default workspace");
    console.log("");
    
    // For safety, we'll just show what needs to be done
    console.log("To proceed, manually run these SQL commands:");
    console.log("");
    console.log("-- Step 1: Apply the migration");
    console.log("-- Run: npx drizzle-kit migrate");
    console.log("");
    console.log("-- Step 2: Create default workspace and backfill (run after migration)");
    console.log(`-- Run: node -r esbuild-register scripts/backfill-workspace.ts`);
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrateExistingData();
