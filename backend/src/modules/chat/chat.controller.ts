import { Request, Response } from "express";
import * as svc from "./chat.service.js";
import { sendPaginated, sendSuccess, sendCreated } from "../../core/utils/response.utils.js";

export const accessChat = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const targetUserId = req.body.userId;
  const chat = await svc.accessDirectChatService(currentUserId, targetUserId, req.user!.universityId);
  sendSuccess(res, chat);
};

export const fetchChats = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const { data, meta } = await svc.fetchUserChatsService(currentUserId, req.query);
  sendPaginated(res, data, meta);
};

export const getChat = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const chat = await svc.getChatByIdService(req.params.id as string, currentUserId, req.user?.role);
  sendSuccess(res, chat);
};

export const createGroupChat = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const group = await svc.createGroupChatService(
    req.body.name,
    req.body.users,
    currentUserId,
    req.user!.universityId
  );
  sendCreated(res, group);
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const chatId = (req.params.chatId || req.body.chatId) as string;
  const message = await svc.sendMessageService({
    senderId: currentUserId,
    chatId,
    content: req.body.content,
    attachment: req.file ? req.file.filename : "",
  });
  sendCreated(res, message);
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const chatId = (req.params.chatId || req.params.id) as string;
  const { data, meta } = await svc.getChatMessagesService(chatId, currentUserId, req.query, req.user?.role);
  sendPaginated(res, data, meta);
};

export const getCourseChat = async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.userId;
  const chat = await svc.getCourseChatService(
    req.params.courseId as string,
    currentUserId,
    req.user!.universityId,
    req.user?.role
  );
  sendSuccess(res, chat);
};
