import { Router } from "express";
import { getAdminDashData } from "../controllers/SystemDataControllers.js";
const router = Router();


router.get("/get-admin-dash", getAdminDashData);

export default router;
