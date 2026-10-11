import { Router } from "express";
import * as ctrl from "./chat.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { accessChatSchema, sendMessageSchema, createGroupChatSchema } from "./chat.validator.js";

const router = Router();

// Legacy and standard endpoints for chats
router.post("/accessChat", enforceDemoReadOnly, validateRequest({ body: accessChatSchema }), ctrl.accessChat);
router.get("/fetchChats", ctrl.fetchChats);
router.post("/group", enforceDemoReadOnly, validateRequest({ body: createGroupChatSchema }), ctrl.createGroupChat);

// Message routes (also support /messages router mounting)
export const messagesRouter = Router();
messagesRouter.post("/addmsg", enforceDemoReadOnly, validateRequest({ body: sendMessageSchema }), ctrl.sendMessage);
messagesRouter.get("/getmsg/:chatId", ctrl.getMessages);
messagesRouter.get("/:chatId", ctrl.getMessages);

export default router;
