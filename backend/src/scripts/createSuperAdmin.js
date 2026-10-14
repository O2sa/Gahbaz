import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import University from "../models/University.js";
import { hashPassword } from "../core/utils/password.utils.js";

/**
 * CLI script to create or promote a Super Admin user.
 * Usage:
 *   node src/scripts/createSuperAdmin.js [--email email] [--password pass] [--firstName name] [--lastName name]
 */
export const createSuperAdmin = async (options = {}) => {
  // Parse command-line flags
  const args = process.argv.slice(2);
  const getArg = (flag, fallback) => {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1]) return args[idx + 1];
    return fallback;
  };

  const email = (options.email || getArg("--email", process.env.SUPER_ADMIN_EMAIL || "superadmin@gahbaz.edu")).toLowerCase().trim();
  const rawPassword = options.password || getArg("--password", process.env.SUPER_ADMIN_PASSWORD || "SuperAdmin@123456");
  const firstName = options.firstName || getArg("--firstName", "Super");
  const lastName = options.lastName || getArg("--lastName", "Admin");
  const phone = options.phone || getArg("--phone", "0500000000");

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGO_URL);
  }

  console.log(`\n🔍 Checking for existing user with email: ${email}...`);
  let existingUser = await User.findOne({ email });

  const hashedPassword = await hashPassword(rawPassword);

  let university = await University.findOne();
  if (!university) {
    university = await University.create({
      name: "جامعة جهبذ الوطنية الذكية",
      code: "GAHBAZ",
      active: true,
    });
    console.log(`🏛️ Created default university: ${university.name}`);
  }

  let superAdmin;

  if (existingUser) {
    console.log(`⚡ Existing user found (ID: ${existingUser._id}, Current Role: ${existingUser.role}). Updating to Super Admin...`);
    existingUser.role = "super-admin";
    existingUser.isAdmin = true;
    existingUser.password = hashedPassword;
    if (existingUser.kind !== "Admin") {
      existingUser.kind = "Admin";
    }
    existingUser.permissions = "rwd";
    if (!existingUser.university) {
      existingUser.university = university._id;
    }
    await existingUser.save();
    superAdmin = existingUser;
    console.log(`✅ User successfully promoted to Super Admin!`);
  } else {
    console.log(`✨ Creating new Super Admin account...`);
    superAdmin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "super-admin",
      isAdmin: true,
      permissions: "rwd",
      kind: "Admin",
      university: university._id,
      lastActivity: new Date(),
    });
    console.log(`✅ Super Admin account created successfully!`);
  }

  console.log("\n==========================================");
  console.log("👑 SUPER ADMIN CREDENTIALS");
  console.log("==========================================");
  console.log(`Email:      ${email}`);
  console.log(`Password:   ${rawPassword}`);
  console.log(`Role:       ${superAdmin.role}`);
  console.log(`User ID:    ${superAdmin._id}`);
  console.log(`University: ${university.name} (${university._id})`);
  console.log("==========================================\n");

  return {
    user: superAdmin,
    email,
    password: rawPassword,
  };
};

// Execute if run directly from CLI
if (process.argv[1]?.replace(/\\/g, "/").endsWith("src/scripts/createSuperAdmin.js")) {
  createSuperAdmin()
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Failed to create super admin:", err);
      await mongoose.disconnect();
      process.exit(1);
    });
}
