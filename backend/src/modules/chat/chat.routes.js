import { Router } from "express";
import * as ctrl from "./chat.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";
import { accessChatSchema, sendMessageSchema, createGroupChatSchema } from "./chat.validator.js";

const router = Router();

// Standard REST Chat endpoints
router.route("/")
  .get(ctrl.fetchChats)
  .post(enforceDemoReadOnly, validateRequest({ body: accessChatSchema }), ctrl.accessChat);

router.post("/group", enforceDemoReadOnly, validateRequest({ body: createGroupChatSchema }), ctrl.createGroupChat);

// Nested REST messages under a chat
router.route("/:chatId/messages")
  .get(ctrl.getMessages)
  .post(enforceDemoReadOnly, validateRequest({ body: sendMessageSchema }), ctrl.sendMessage);

router.route("/:id")
  .get(ctrl.getChat);

// Aliases for chat operations
router.post("/accessChat", enforceDemoReadOnly, validateRequest({ body: accessChatSchema }), ctrl.accessChat);
router.get("/fetchChats", ctrl.fetchChats);

// Legacy messagesRouter export for compatibility during transition
export const messagesRouter = Router();
messagesRouter.post("/addmsg", enforceDemoReadOnly, validateRequest({ body: sendMessageSchema }), ctrl.sendMessage);
messagesRouter.get("/getmsg/:chatId", ctrl.getMessages);
messagesRouter.get("/:chatId", ctrl.getMessages);

export default router;
