import * as svc from "./chat.service.js";

export const accessChat = async (req, res) => {
  const chat = await svc.accessDirectChatService(req.user.id, req.body.userId);
  res.status(200).json(chat);
};

export const fetchChats = async (req, res) => {
  const chats = await svc.fetchUserChatsService(req.user.id);
  res.status(200).json(chats);
};

export const createGroupChat = async (req, res) => {
  const group = await svc.createGroupChatService(req.body.name, req.body.users, req.user.id);
  res.status(200).json(group);
};

export const sendMessage = async (req, res) => {
  const message = await svc.sendMessageService({
    senderId: req.user.id, // Strictly bind sender to authenticated user!
    chatId: req.body.chatId,
    content: req.body.content,
    attachment: req.file ? req.file.filename : "",
  });
  res.status(200).json(message);
};

export const getMessages = async (req, res) => {
  const messages = await svc.getChatMessagesService(req.params.chatId, req.user.id);
  res.status(200).json(messages);
};
