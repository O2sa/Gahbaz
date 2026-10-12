import * as svc from "./chat.service.js";
import { sendSuccess, sendCreated } from "../../core/utils/response.utils.js";

export const accessChat = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const targetUserId = req.body.userId;
  const chat = await svc.accessDirectChatService(currentUserId, targetUserId, req.user.universityId);
  sendSuccess(res, chat);
};

export const fetchChats = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const chats = await svc.fetchUserChatsService(currentUserId);
  sendSuccess(res, chats);
};

export const getChat = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const chat = await svc.getChatByIdService(req.params.id, currentUserId);
  sendSuccess(res, chat);
};

export const createGroupChat = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const group = await svc.createGroupChatService(
    req.body.name,
    req.body.users,
    currentUserId,
    req.user.universityId
  );
  sendCreated(res, group);
};

export const sendMessage = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const chatId = req.params.chatId || req.body.chatId;
  const message = await svc.sendMessageService({
    senderId: currentUserId,
    chatId,
    content: req.body.content,
    attachment: req.file ? req.file.filename : "",
  });
  sendCreated(res, message);
};

export const getMessages = async (req, res) => {
  const currentUserId = req.user.userId || req.user.id;
  const chatId = req.params.chatId || req.params.id;
  const messages = await svc.getChatMessagesService(chatId, currentUserId);
  sendSuccess(res, messages);
};
