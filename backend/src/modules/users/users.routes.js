import { Router } from "express";
import {
  getCurrentUser,
  getUser,
  updateUser,
  changePassword,
  legacyGetAllUsers,
  legacyRenameUser,
} from "./users.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { updateUserSchema, changePasswordSchema } from "./users.validator.js";
import { enforceDemoReadOnly } from "../../core/middleware/rbac.middleware.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.route("/:id").get(getUser).patch(enforceDemoReadOnly, validateRequest({ body: updateUserSchema }), updateUser);
router.post("/:id/change-pass", enforceDemoReadOnly, validateRequest({ body: changePasswordSchema }), changePassword);

// Router for legacy /api/v1/au compatibility
export const legacyAuRouter = Router();
legacyAuRouter.get("/allUsers", legacyGetAllUsers);
legacyAuRouter.put("/renameUser", enforceDemoReadOnly, legacyRenameUser);

export default router;
