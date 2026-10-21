import mongoose from "mongoose";

const PerformanceMetricSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    cpuUsage: {
      type: Number,
      default: 0,
    },
    memoryUsage: {
      total: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
    },
    diskUsage: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
      percent: { type: Number, default: 0 },
    },
    networkUsage: {
      incoming: { type: Number, default: 0 },
      outgoing: { type: Number, default: 0 },
    },
    uptime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "performance_metrics",
  }
);

export default mongoose.models.PerformanceMetric ||
  mongoose.model("PerformanceMetric", PerformanceMetricSchema, "performance_metrics");
