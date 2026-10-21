import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";

/**
 * Migration script: populates the primary `name` field for all users where
 * `name` is missing, empty, or null, using legacy `firstName` and `lastName`.
 *
 * Usage:
 *   node src/scripts/migrate-user-names.js [--dry-run]
 */
export const migrateUserNames = async (options = {}) => {
  const isDryRun = options.dryRun ?? process.argv.includes("--dry-run");

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGO_URL);
    console.log("Connected to MongoDB:", env.MONGO_URL.replace(/:[^:@]+@/, ":****@"));
  }

  console.log(`\n🔍 Searching for users missing 'name' field (Dry-run: ${isDryRun})...`);

  const usersToMigrate = await User.find({
    $or: [
      { name: { $exists: false } },
      { name: null },
      { name: "" },
      { name: { $regex: /^\s*$/ } },
    ],
  });

  console.log(`Found ${usersToMigrate.length} user(s) requiring migration.`);

  let updatedCount = 0;

  for (const user of usersToMigrate) {
    const combined = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    // Fallback if both first/last name were blank
    let computedName = combined || user.email?.split("@")[0] || "مستخدم";

    // Clean any invalid characters so it adheres to strict validation
    computedName = computedName.replace(/[^ \u0600-\u06FFa-zA-Z\-]/g, " ").replace(/\s+/g, " ").trim();
    if (computedName.length < 3) {
      computedName = `${computedName} مستخدم`;
    }
    if (computedName.length > 70) {
      computedName = computedName.slice(0, 70).trim();
    }

    if (isDryRun) {
      console.log(`  [DRY-RUN] User ID ${user._id} (${user.email}): would set name to "${computedName}"`);
    } else {
      await User.updateOne({ _id: user._id }, { $set: { name: computedName } });
      console.log(`  ✓ Updated User ID ${user._id} (${user.email}) -> name: "${computedName}"`);
    }
    updatedCount++;
  }

  console.log(`\n✅ Migration complete. ${updatedCount} user(s) ${isDryRun ? "evaluated" : "updated"}.\n`);
  return { total: usersToMigrate.length, updated: updatedCount };
};

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith("migrate-user-names.js")) {
  migrateUserNames()
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Migration failed:", err);
      await mongoose.disconnect();
      process.exit(1);
    });
}
