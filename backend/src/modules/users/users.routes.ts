import { Router } from "express";
import * as ctrl from "./users.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { updateUserSchema, changePasswordSchema } from "./users.validator.js";
import { paginationQuerySchema } from "../../core/utils/pagination.utils.js";

const router = Router();

router.get("/me", ctrl.getCurrentUser);
router.get("/current-user", ctrl.getCurrentUser);
router.get("/showMe", ctrl.getCurrentUser);
router.get("/show-me", ctrl.getCurrentUser);
router.patch("/me/password", validateRequest({ body: changePasswordSchema }), ctrl.changePassword);
router.patch("/me/profile", validateRequest({ body: updateUserSchema }), ctrl.updateUser);
router.post("/:id/change-pass", validateRequest({ body: changePasswordSchema }), ctrl.changePassword);
router.patch("/:id/change-pass", validateRequest({ body: changePasswordSchema }), ctrl.changePassword);
router.post("/updateUserPassword", validateRequest({ body: changePasswordSchema }), ctrl.changePassword);

router
  .route("/")
  .get(validateRequest({ query: paginationQuerySchema }), ctrl.listUsers);

router
  .route("/:id([0-9a-fA-F]{24})")
  .get(ctrl.getUser)
  .patch(validateRequest({ body: updateUserSchema }), ctrl.updateUser)
  .delete(ctrl.deleteUser);

// Fallback for :id
router
  .route("/:id")
  .get(ctrl.getUser)
  .patch(validateRequest({ body: updateUserSchema }), ctrl.updateUser)
  .delete(ctrl.deleteUser);

export default router;
