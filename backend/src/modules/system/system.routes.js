import { Router } from "express";
import { getAdminDashData, search } from "./system.controller.js";
import { requireRoles } from "../../core/middleware/rbac.middleware.js";

const router = Router();

router.get("/adminDashData", requireRoles("admin", "super-admin"), getAdminDashData);
router.get("/search", search);

export default router;
