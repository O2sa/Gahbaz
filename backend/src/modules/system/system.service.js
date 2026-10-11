import os from "node:os";
import User from "../../../models/User.js";
import Collage from "../../../models/Collage.js";
import Major from "../../../models/Major.js";
import Course from "../../../models/Course.js";
import Logger from "../../../models/Logger.js";
import Performance from "../../../models/Performance.js";

export const calculateThreeMonthsAgo = (from = new Date()) => {
  const d = new Date(from);
  d.setMonth(d.getMonth() - 3);
  return d;
};

export const calculateThreeDaysAgo = (from = new Date()) => {
  const d = new Date(from);
  d.setDate(d.getDate() - 3);
  return d;
};

export const sanitizeSearchQuery = (str = "") => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getSystemHealthService = () => {
  const uptime = os.uptime();
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const cpus = os.cpus();

  // Loadavg fallback for Windows
  let load = os.loadavg();
  let avgLoad = Array.isArray(load) && load[0] > 0 ? load[0] : 0;
  if (avgLoad === 0 && cpus.length > 0) {
    avgLoad = cpus.reduce((acc, cpu) => acc + (cpu.times.user / (cpu.times.idle + cpu.times.user || 1)), 0) / cpus.length;
  }

  return {
    memory: [
      { name: "Total Memory", value: Math.round(totalMemory / (1024 * 1024)) },
      { name: "Free Memory", value: Math.round(freeMemory / (1024 * 1024)) },
    ],
    cpu: [
      { name: "CPU Usage", value: Math.round(avgLoad * 100) / 100 },
      { name: "Uptime Hours", value: Math.round((uptime / 3600) * 100) / 100 },
    ],
  };
};

export const getAdminDashboardStatsService = async (universityId) => {
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  const activeUsers = await User.countDocuments({
    lastActivity: { $gte: fiveMinAgo },
    ...(universityId ? { university: universityId } : {}),
  });

  const threeDaysAgo = calculateThreeDaysAgo();
  const loginTimes = await Logger.aggregate([
    { $match: { timestamp: { $gte: threeDaysAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" },
        },
        loginCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
  ]);

  const systemHealth = getSystemHealthService();
  const metrics = await Performance.find().sort({ timestamp: -1 }).limit(50);

  return { activeUsers, loginTimes, systemHealth, metrics };
};

export const searchEntitiesService = async (query, user) => {
  if (!query || typeof query !== "string") return {};
  const safeQuery = sanitizeSearchQuery(query);
  const regex = new RegExp(safeQuery, "i");

  switch (user.role) {
    case "teacher": {
      const courses = await Course.find({
        name: regex,
        teachers: user.id, // Fixed: 'teachers' array instead of singular 'teacher'
      });
      return { courses };
    }
    case "admin":
    case "super-admin": {
      const users = await User.find({
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
      }).select("-password");
      const collages = await Collage.find({ name: regex, university: user.universityId });
      const majors = await Major.find({ name: regex });
      return { users, collages, majors };
    }
    case "student": {
      const student = await User.findById(user.id);
      const courses = await Course.find({
        name: regex,
        semester: { $in: student?.semesters || [] },
      });
      return { courses };
    }
    default:
      return {};
  }
};
