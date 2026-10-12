import { Router } from "express";
import { register, login, logout, getMe } from "./auth.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { authenticateUser } from "../../core/middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "./auth.validator.js";

const router = Router();

router.post("/register", validateRequest({ body: registerSchema }), register);
router.post("/login", validateRequest({ body: loginSchema }), login);
router.post("/logout", logout);
router.get("/logout", logout);
router.get("/me", authenticateUser, getMe);

export default router;
