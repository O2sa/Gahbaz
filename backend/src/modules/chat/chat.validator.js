import { z } from "zod";

export const accessChatSchema = z.object({
  userId: z.string().min(1, "Target userId is required"),
});

export const sendMessageSchema = z.object({
  chatId: z.string().min(1, "chatId is required"),
  content: z.string().optional(),
});

export const createGroupChatSchema = z.object({
  name: z.string().min(1, "Group chat name is required"),
  users: z.union([z.string(), z.array(z.string())]),
});

export const updateGroupChatSchema = z.object({
  chatId: z.string().min(1),
  chatName: z.string().min(1).optional(),
});
