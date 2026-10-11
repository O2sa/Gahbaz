import { Router } from "express";
import { register, login, logout } from "./auth.controller.js";
import { validateRequest } from "../../core/middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.validator.js";

const router = Router();

router.post("/register", validateRequest({ body: registerSchema }), register);
router.post("/login", validateRequest({ body: loginSchema }), login);
router.get("/logout", logout);

export default router;
