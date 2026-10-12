import { Router } from "express";
import * as ctrl from "./chat.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { accessChatSchema, sendMessageSchema, createGroupChatSchema } from "./chat.validator.js";

const router = Router();

// Standard REST Chat endpoints
router.route("/")
  .get(ctrl.fetchChats)
  .post(validateRequest({ body: accessChatSchema }), ctrl.accessChat);

router.post("/group", validateRequest({ body: createGroupChatSchema }), ctrl.createGroupChat);

// Nested REST messages under a chat
router.route("/:chatId/messages")
  .get(ctrl.getMessages)
  .post(validateRequest({ body: sendMessageSchema }), ctrl.sendMessage);

router.route("/:id")
  .get(ctrl.getChat);

// Aliases for chat operations
router.post("/accessChat", validateRequest({ body: accessChatSchema }), ctrl.accessChat);
router.get("/fetchChats", ctrl.fetchChats);

export const messagesRouter = Router();
messagesRouter.post("/addmsg", validateRequest({ body: sendMessageSchema }), ctrl.sendMessage);
messagesRouter.get("/getmsg/:chatId", ctrl.getMessages);
messagesRouter.get("/:chatId", ctrl.getMessages);

export default router;
