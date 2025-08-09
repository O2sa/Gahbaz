import { Router } from "express";
import { getAdminDashData, search } from "../controllers/SystemDataControllers.js";
const router = Router();


router.get("/get-admin-dash", getAdminDashData);
router.get("/search", search);

export default router;
