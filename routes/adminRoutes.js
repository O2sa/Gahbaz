import { Router } from "express";
const router = Router();

import {
deleteAdmin,
getAdmin,
getAllAdmins,
updateAdmin,
createAdmin
} from "../controllers/adminControllers.js"

router.route("/").post(createAdmin).get(getAllAdmins)
router
  .route("/:id")
  .patch(updateAdmin)
  .patch(updateAdmin)
  .get(getAdmin)

export default router;
