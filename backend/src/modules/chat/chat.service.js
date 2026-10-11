import Chat from "../../../models/chatModel.js";
import Messages from "../../../models/messageModel.js";
import User from "../../../models/User.js";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../../core/errors/customErrors.js";

export const accessDirectChatService = async (currentUserId, targetUserId) => {
  if (!targetUserId) throw new BadRequestError("Target userId is required");

  let isChat = await Chat.findOne({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: currentUserId } } },
      { users: { $elemMatch: { $eq: targetUserId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (isChat) {
    return User.populate(isChat, {
      path: "latestMessage.sender",
      select: "email avatar lastName firstName",
    });
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new NotFoundError("Target user not found");

  const createdChat = await Chat.create({
    chatName: `${targetUser.firstName || "Direct"} ${targetUser.lastName || "Chat"}`,
    isGroupChat: false,
    users: [currentUserId, targetUserId],
  });

  return Chat.findById(createdChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
};

export const fetchUserChatsService = async (userId) => {
  const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  return User.populate(chats, {
    path: "latestMessage.sender",
    select: "lastName firstName avatar email",
  });
};

export const createGroupChatService = async (groupName, users, currentUserId) => {
  let userList = typeof users === "string" ? JSON.parse(users) : users;
  if (!Array.isArray(userList) || userList.length < 1) {
    throw new BadRequestError("More than 1 user is required to form a group chat");
  }

  if (!userList.includes(currentUserId)) {
    userList.push(currentUserId);
  }

  const groupChat = await Chat.create({
    chatName: groupName,
    users: userList,
    isGroupChat: true,
    groupAdmin: currentUserId,
    groupPic: "default-group.svg",
  });

  return Chat.findById(groupChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
};

export const sendMessageService = async ({ senderId, chatId, content, attachment = "" }) => {
  const chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: senderId } } });
  if (!chat) {
    throw new UnauthorizedError("You are not a member of this chat");
  }

  let message = await Messages.create({
    sender: senderId,
    content: content || "",
    chat: chatId,
    attachment,
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id }, { new: true });

  message = await message.populate("sender", "email avatar lastName firstName");
  message = await message.populate({
    path: "chat",
    populate: { path: "latestMessage", populate: { path: "sender", select: "firstName lastName email" } },
  });

  return message;
};

export const getChatMessagesService = async (chatId, currentUserId) => {
  const chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: currentUserId } } });
  if (!chat) {
    throw new UnauthorizedError("You are not a member of this chat");
  }

  return Messages.find({ chat: chatId })
    .populate("sender", "email avatar lastName firstName")
    .populate({
      path: "chat",
      populate: { path: "latestMessage", populate: { path: "sender", select: "firstName lastName email" } },
    });
};
