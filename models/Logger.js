// Example using Mongoose for MongoDB
import mongoose from 'mongoose'
const loginSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Logger', loginSchema);