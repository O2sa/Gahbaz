import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMemoryUsage {
  total: number;
  percent: number;
  used: number;
}

export interface IPerformanceMetric extends Document {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: IMemoryUsage;
  uptime: number;
  createdAt: Date;
  updatedAt: Date;
}

const PerformanceMetricSchema = new Schema<IPerformanceMetric>(
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

export default (mongoose.models.PerformanceMetric as Model<IPerformanceMetric>) ||
  mongoose.model<IPerformanceMetric>(
    "PerformanceMetric",
    PerformanceMetricSchema,
    "performance_metrics"
  );
