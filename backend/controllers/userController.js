import path from "path";
import fs from "fs";
import { promisify } from "util";
const unlinkAsync = promisify(fs.unlink);

import User from "../models/User.js";
import Chat from "../models/chatModel.js";
import Messages from "../models/messageModel.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? { email: { $regex: req.query.search, $options: "i" } }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (e) {
    next(e);
  }
};

export const renameUser = async (req, res) => {
  const { userId, newUsername } = req.body;
  const usernameCheck = await User.findOne({ username: newUsername });
  if (usernameCheck) {
    return res.json({ msg: "The username is already used", status: false });
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      username: newUsername,
    },
    { new: true }
  );
  if (!updatedUser) {
    res.status(404);
    throw new Error("User Not Found");
  } else {
    res.json({
      status: true,
      updatedUser: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin,
        // token: generateToken(updatedUser._id),
      },
    });
  }
};

export const emailUpdate = async (req, res) => {
  const { userId, newEmail } = req.body;
  const emailCheck = await User.findOne({ email: newEmail });
  if (emailCheck)
    return res.json({ msg: "The email is already used", status: false });
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email: newEmail },
    { new: true }
  );
  if (!updatedUser) {
    res.status(404);
    throw new Error("User Not Found");
  } else {
    res.json({
      status: true,
      updatedUser: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin,
        // token: generateToken(updatedUser._id),
      },
    });
  }
};

export const avatarUpdate = async (req, res) => {
  const { userId } = req.body;
  const avatarUrl = req.file ? req.file.filename : "default.svg";
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { new: true }
  );
  if (!updatedUser) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json({
      status: true,
      updatedUser: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin,
        // token: generateToken(updatedUser._id),
      },
    });
  }
};

export const passwordUpdate = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  const user = await User.findOne({ _id: userId });
  const isPasswordValid = await comparePassword(oldPassword, user.password);

  if (!isPasswordValid) {
    return res.json({ msg: "Incorrect password", status: false });
  }

  const hashedPassword = await hashPassword(newPassword);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      password: hashedPassword,
    },
    { new: true }
  );

  if (!updatedUser) {
    res.status(404);
    throw new Error("User Not Found");
  } else {
    delete updatedUser.password;
    res.json({ status: true });
  }
};

export const deleteProfile = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  const allChats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  });
  const groupAdminChats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
    groupAdmin: userId,
  });
  const avatarUrl = user.avatar;

  if (groupAdminChats.length !== 0 && groupAdminChats !== undefined) {
    let groupPicArr = [];
    groupAdminChats.map((chat) => {
      groupPicArr.push(chat.groupPic);
    });
    const filtered = groupPicArr.filter((pic) => pic !== "default-group.svg");
    filtered.map(async (pic) => {
      await unlinkAsync(path.join(__dirname, "../profile_pictures/", pic));
    });
  }

  if (avatarUrl && avatarUrl !== "default.svg") {
    await unlinkAsync(path.join(__dirname, "../profile_pictures/", avatarUrl));
  }

  const removedMessages = await Messages.deleteMany({ chat: allChats });
  await Chat.deleteMany({
    users: { $elemMatch: { $eq: req.user._id } },
    groupAdmin: userId,
  });
  await Chat.updateMany(
    { users: { $elemMatch: { $eq: req.user._id } }, isGroupChat: true },
    { $pull: { users: userId } },
    { new: true }
  );

  const removedNotGroupChats = await Chat.deleteMany({
    users: { $elemMatch: { $eq: req.user._id } },
    isGroupChat: false,
  });
  const removed = await User.deleteOne({ _id: userId });
  if (!removed || !removedNotGroupChats || !removedMessages) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json({ status: true });
  }
};
