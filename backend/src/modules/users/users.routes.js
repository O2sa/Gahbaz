import { Router } from "express";
import {
  listUsers,
  getCurrentUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
} from "./users.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { updateUserSchema, changePasswordSchema } from "./users.validator.js";
import { enforceDemoReadOnly, requireRoles } from "../../core/middleware/rbac.middleware.js";

const router = Router();

router.get("/me", getCurrentUser);
router.get("/current-user", getCurrentUser);
router.patch("/me/password", enforceDemoReadOnly, validateRequest({ body: changePasswordSchema }), changePassword);
router.patch("/me/profile", enforceDemoReadOnly, validateRequest({ body: updateUserSchema }), updateUser);

router
  .route("/")
  .get(listUsers);

router
  .route("/:id")
  .get(getUser)
  .patch(enforceDemoReadOnly, validateRequest({ body: updateUserSchema }), updateUser)
  .delete(enforceDemoReadOnly, deleteUser);

export default router;
