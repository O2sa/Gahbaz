import mongoose from "mongoose";
import User from "../models/User.js";
import { hashPassword } from "../core/utils/password.utils.js";
import env from "../config/env.js";

const demoUsers = [
  {
    firstName: "Demo",
    lastName: "Admin",
    email: "admin@test.com",
    plainPassword: "admin@test.com",
    role: "admin",
    isAdmin: true,
  },
  {
    firstName: "Demo",
    lastName: "Teacher",
    email: "teacher@tech.com",
    plainPassword: "teacher@tech.com",
    role: "teacher",
    isAdmin: false,
  },
  {
    firstName: "Demo",
    lastName: "Student",
    email: "student@test.com",
    plainPassword: "student@test.com",
    role: "student",
    isAdmin: false,
  },
];

export const seedDemoUsers = async () => {
  const isDirectRun = import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`;
  if (isDirectRun || mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGO_URL);
  }

  for (const demo of demoUsers) {
    const existing = await User.findOne({ email: demo.email });
    const hashedPassword = await hashPassword(demo.plainPassword);

    if (!existing) {
      await User.create({
        firstName: demo.firstName,
        lastName: demo.lastName,
        email: demo.email,
        password: hashedPassword,
        role: demo.role,
        isAdmin: demo.isAdmin,
      });
      console.log(`[Seed] Created demo user: ${demo.email}`);
    } else {
      existing.password = hashedPassword;
      existing.role = demo.role;
      existing.isAdmin = demo.isAdmin;
      await existing.save();
      console.log(`[Seed] Updated demo user password: ${demo.email}`);
    }
  }

  if (isDirectRun) {
    await mongoose.connection.close();
    console.log("[Seed] Completed successfully.");
  }
};

if (process.argv[1] && import.meta.url.includes(process.argv[1].replace(/\\/g, "/"))) {
  seedDemoUsers().catch((err) => {
    console.error("[Seed Error]", err);
    process.exit(1);
  });
}
