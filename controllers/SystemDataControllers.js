import { StatusCodes } from "http-status-codes";
import {
  getActiveUsers,
  getLoginsLastThreeDays,
  getLoginsLastThreeMonths,
  getSystemHealth,
} from "../utils/dataCollector.js";
import Performance from "../models/Performance.js";
import User from "../models/User.js";
import Collage from "../models/Collage.js";
import Course from "../models/Course.js";
import Major from "../models/Major.js";

export const getAdminDashData = async (req, res) => {
  const activeUsers = await getActiveUsers();
  const systemHealth = await getSystemHealth();
  const loginTimes = await getLoginsLastThreeDays();
  const metrics = await Performance.find().sort({ timestamp: -1 }).limit(100); // Get the latest 100 metrics
  res
    .status(StatusCodes.OK)
    .json({ activeUsers, loginTimes, systemHealth, metrics });
};

export const search = async (req, res) => {
  const query = req.query.q;
  const user = req.user;
  let data = {};

  switch (user.__t) {
    case "Teacher": {
      const courses = await Course.find({
        name: new RegExp(query, "i"),
        teacher: user._id,
      });
      data = { courses };
      break;
    }
    case "Admin": {
      const users = await User.find({ name: new RegExp(query, "i") });
      const collages = await Collage.find({ name: new RegExp(query, "i") });
      const majors = await Major.find({ name: new RegExp(query, "i") });
      data = { users, collages, majors };

      break;
    }

    case "Student": {
      const courses = await Course.find({
        name: new RegExp(query, "i"),
        semester: {
          $in: user.semesters,
        },
      });
      data = { courses };
    }
  }

  res.status(StatusCodes.OK).json(data);
};
