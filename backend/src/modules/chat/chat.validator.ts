import { z } from "zod";

export const accessChatSchema = z.object({
  userId: z.string().min(1, "Target userId is required"),
});

export type AccessChatInput = z.infer<typeof accessChatSchema>;

export const sendMessageSchema = z.object({
  chatId: z.string().min(1, "chatId is required"),
  content: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const createGroupChatSchema = z.object({
  name: z.string().min(1, "Group chat name is required"),
  users: z.union([z.string(), z.array(z.string())]),
});

export type CreateGroupChatInput = z.infer<typeof createGroupChatSchema>;

export const updateGroupChatSchema = z.object({
  chatId: z.string().min(1),
  chatName: z.string().min(1).optional(),
});

export type UpdateGroupChatInput = z.infer<typeof updateGroupChatSchema>;
