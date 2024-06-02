import User from "../models/User.js";

export const activityLogger = async (req, res, next) => {
  const userId = req.user._id; // Assuming req.user contains authenticated user info

  // Update user's last activity timestamp in the database
 const user= await User.findByIdAndUpdate(
    userId,
    { lastActivity: new Date() },
    { new: true }
  );


  next();
};
