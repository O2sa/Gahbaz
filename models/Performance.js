import mongoose from "mongoose";

const metricSchema = new mongoose.Schema({
  timestamp: Date,
  cpuUsage: Number,
  memoryUsage: {
    total: Number,
    percent: Number,
    used: Number,
  },
  diskUsage: {
    total: Number,
    used: Number,
    percent: Number,
  },
  networkUsage: {
    incoming: Number,
    outgoing: Number,
  },
  uptime: Number,
});

export default mongoose.model('Performance', metricSchema);

