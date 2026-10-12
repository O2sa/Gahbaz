import { Router } from "express";
import * as ctrl from "./users.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { updateUserSchema, changePasswordSchema } from "./users.validator.js";

const router = Router();

router.get("/me", ctrl.getCurrentUser);
router.get("/current-user", ctrl.getCurrentUser);
router.patch("/me/password", validateRequest({ body: changePasswordSchema }), ctrl.changePassword);
router.patch("/me/profile", validateRequest({ body: updateUserSchema }), ctrl.updateUser);

router
  .route("/")
  .get(ctrl.listUsers);

router
  .route("/:id")
  .get(ctrl.getUser)
  .patch(validateRequest({ body: updateUserSchema }), ctrl.updateUser)
  .delete(ctrl.deleteUser);

export default router;
