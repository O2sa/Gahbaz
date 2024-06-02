import Logger from "../models/Logger.js";
import User from "../models/User.js";
import os from "os";
import osu from "node-os-utils";
import Performance from "../models/Performance.js";
const { cpu, mem, drive, netstat } = osu;

export async function logLogin(userId) {
  const loginEvent = new Logger({ userId });
  await loginEvent.save();
}

export const getActiveUsers = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  try {
    const activeUsers = await User.find({
      lastActivity: { $gte: fiveMinutesAgo },
    });
    return activeUsers;
  } catch (error) {
    console.error("Error fetching active users:", error);
    throw error;
  }
};

export const getSystemHealth = async () => {
  const uptime = os.uptime(); // uptime in seconds
  const cpuUsage = os.loadavg(); // CPU load averages
  const freeMemory = os.freemem(); // Free memory in bytes
  const totalMemory = os.totalmem(); // Total memory in bytes

  return {
    memory: [
      { name: "اجمالي ذاكرة التخزين", value: totalMemory / (1024 * 1024) },
      {
        name: "الفارغ من ذاكرة التخزين",
        value: freeMemory / (1024 * 1024),
      },
    ],
    cpu: [
      {
        name: "استخدام المعالجة",
        value: Array.isArray(cpuUsage) ? getAverage(cpuUsage) : cpuUsage,
      },
      { name: "اجمالي وقت التشغيل", value: uptime / (60 * 60) },
    ],
  };
};

export async function getLoginsLastThreeMonths() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getDay() - 3);

  const lgs = await Logger.find();
  console.log(lgs);
  try {
    const result = await Logger.aggregate([
      {
        $match: {
          timestamp: { $gte: threeMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
          },
          loginCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          loginCount: 1,
        },
      },
    ]);

    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getLoginsLastThreeDays() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  try {
    const result = await Logger.aggregate([
      {
        $match: {
          timestamp: { $gte: threeDaysAgo },
        },
      },
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
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          loginCount: 1,
        },
      },
    ]);

    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function getAverage(items) {
  let avr = 0;
  for (const item of items) avr += item;

  return avr / items.length;
}

export async function getSystemMetrics() {
  const cpuUsage = await cpu.usage();
  const memInfo = await mem.info();
  const driveInfo = await drive.info();
  const netStats = await netstat.stats();

  return {
    timestamp: new Date(),
    cpuUsage,
    memoryUsage: {
      total: memInfo.totalMemMb,
      percent: memInfo.usedMemPercentage,
      used: memInfo.usedMemMb,
    },
    diskUsage: {
      total: driveInfo.totalGb ,
      used: driveInfo.usedGb ,
      percent: driveInfo.usedPercentage,
    },
    networkUsage: {
      incoming:
        netStats.reduce((acc, iface) => acc + iface.inputBytes, 0) / 1024,
      outgoing:
        netStats.reduce((acc, iface) => acc + iface.outputBytes, 0) / 1024,
    },
    uptime: os.uptime() / (60 * 60),
  };
}

export async function collectAndStoreMetrics() {
  const metrics = await getSystemMetrics();
  const metricDocument = new Performance(metrics);
  //   console.log(metricDocument)
  await metricDocument.save();
}
