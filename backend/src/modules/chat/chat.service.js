import Chat from "../../models/Chat.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import Course from "../../models/Course.js";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../../core/errors/customErrors.js";
import { paginateQuery, parsePagination } from "../../core/utils/pagination.utils.js";

export const accessDirectChatService = async (currentUserId, targetUserId, universityId) => {
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
    university: universityId,
  });

  return Chat.findById(createdChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
};

export const fetchUserChatsService = async (userId, query = {}) => {
  const { page, limit } = parsePagination(query);
  const result = await paginateQuery(
    Chat,
    { users: { $elemMatch: { $eq: userId } } },
    {
      page,
      limit,
      sort: { updatedAt: -1 },
      populate: [
        { path: "users", select: "-password" },
        { path: "groupAdmin", select: "-password" },
        { path: "latestMessage" },
      ],
    }
  );

  result.data = await User.populate(result.data, {
    path: "latestMessage.sender",
    select: "lastName firstName avatar email",
  });

  return result;
};

export const getChatByIdService = async (chatId, currentUserId) => {
  const chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: currentUserId } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");
  if (!chat) throw new NotFoundError("Chat not found or access denied");
  return chat;
};

export const createGroupChatService = async (groupName, users, currentUserId, universityId) => {
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
    university: universityId,
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

  let message = await Message.create({
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

export const getChatMessagesService = async (chatId, currentUserId, query = {}) => {
  const chat = await Chat.findOne({ _id: chatId, users: { $elemMatch: { $eq: currentUserId } } });
  if (!chat) {
    throw new UnauthorizedError("You are not a member of this chat");
  }

  const { page, limit } = parsePagination(query);
  return paginateQuery(
    Message,
    { chat: chatId },
    {
      page,
      limit,
      sort: { createdAt: 1 },
      populate: [
        { path: "sender", select: "email avatar lastName firstName" },
        {
          path: "chat",
          populate: { path: "latestMessage", populate: { path: "sender", select: "firstName lastName email" } },
        },
      ],
    }
  );
};

export const ensureCourseChatChannel = async (courseId) => {
  const course = await Course.findById(courseId).populate("teachers");
  if (!course) throw new NotFoundError("Course not found");

  const teacherIds = (course.teachers || []).map((t) => (t._id ? t._id.toString() : t.toString()));
  const studentIds = (course.students || []).map((s) => (s.student ? s.student.toString() : s.toString()));
  const allUserIds = Array.from(new Set([...teacherIds, ...studentIds]));

  const primaryAdmin = teacherIds[0] || allUserIds[0];

  let chat = await Chat.findOne({ course: course._id });

  if (chat) {
    const existingUserIds = chat.users.map((u) => u.toString());
    const updatedUsers = Array.from(new Set([...existingUserIds, ...allUserIds]));
    chat.users = updatedUsers;
    if (primaryAdmin && !chat.groupAdmin) {
      chat.groupAdmin = primaryAdmin;
    }
    await chat.save();
    return chat;
  }

  chat = await Chat.create({
    chatName: `دورة ${course.name}`,
    course: course._id,
    isGroupChat: true,
    users: allUserIds,
    groupAdmin: primaryAdmin,
    groupPic: "default-group.svg",
    university: course.university,
  });

  return chat;
};

export const syncCourseStudentRoster = async ({ courseId, studentId, action = "add" }) => {
  if (action === "add") {
    return Chat.findOneAndUpdate(
      { course: courseId },
      { $addToSet: { users: studentId } },
      { new: true }
    );
  } else if (action === "drop") {
    return Chat.findOneAndUpdate(
      { course: courseId },
      { $pull: { users: studentId } },
      { new: true }
    );
  }
};
