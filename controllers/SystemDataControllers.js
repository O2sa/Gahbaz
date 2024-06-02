import { StatusCodes } from 'http-status-codes';
import { getActiveUsers, getLoginsLastThreeDays, getLoginsLastThreeMonths, getSystemHealth } from '../utils/dataCollector.js';
import Performance from '../models/Performance.js';



export const getAdminDashData = async (req, res) => {
  const activeUsers=await getActiveUsers()
  const systemHealth=await getSystemHealth()
  const loginTimes=await getLoginsLastThreeDays()
  const metrics = await Performance.find().sort({ timestamp: -1 }).limit(100); // Get the latest 100 metrics
    res.status(StatusCodes.OK).json({activeUsers, loginTimes, systemHealth,metrics});
  };