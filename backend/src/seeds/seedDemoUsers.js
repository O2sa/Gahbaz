import mongoose from "mongoose";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import University from "../models/University.js";
import { hashPassword } from "../core/utils/password.utils.js";
import env from "../config/env.js";

const demoUsers = [
  {
    name: "عبدالرحمن الغامدي",
    firstName: "عبدالرحمن",
    lastName: "الغامدي",
    email: "admin@test.com",
    plainPassword: "admin@test.com",
    role: "admin",
    isAdmin: true,
    permissions: "rw",
    kind: "Admin",
  },
  {
    name: "مدير الجامعة",
    firstName: "مدير",
    lastName: "الجامعة",
    email: "univ.admin@gahbaz.edu",
    plainPassword: "Password123!",
    role: "admin",
    isAdmin: true,
    permissions: "rw",
    kind: "Admin",
  },
  {
    name: "Demo Teacher",
    firstName: "Demo",
    lastName: "Teacher",
    email: "teacher@tech.com",
    plainPassword: "teacher@tech.com",
    role: "teacher",
    isAdmin: false,
    kind: "Teacher",
  },
  {
    name: "Demo Student",
    firstName: "Demo",
    lastName: "Student",
    email: "student@test.com",
    plainPassword: "student@test.com",
    role: "student",
    isAdmin: false,
    kind: "Student",
  },
];

export const seedDemoUsers = async () => {
  const isDirectRun = import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, "/")}`;
  if (isDirectRun || mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGO_URL);
  }

  const primaryUniversity = await University.findOne();

  for (const demo of demoUsers) {
    const existing = await User.findOne({ email: demo.email });
    const hashedPassword = await hashPassword(demo.plainPassword);

    if (!existing) {
      await User.create({
        name: demo.name,
        firstName: demo.firstName,
        lastName: demo.lastName,
        email: demo.email,
        password: hashedPassword,
        role: demo.role,
        isAdmin: demo.isAdmin,
        kind: demo.kind,
        permissions: demo.permissions,
        ...(primaryUniversity ? { university: primaryUniversity._id } : {}),
      });
      console.log(`[Seed] Created demo user: ${demo.email}`);
    } else {
      existing.name = demo.name || existing.name;
      existing.password = hashedPassword;
      existing.role = demo.role;
      existing.isAdmin = demo.isAdmin;
      if (demo.kind) existing.kind = demo.kind;
      if (demo.permissions) existing.permissions = demo.permissions;
      if (primaryUniversity && !existing.university) {
        existing.university = primaryUniversity._id;
      }
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
