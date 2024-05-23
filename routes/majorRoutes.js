import { Router } from "express";
const router = Router();
import {
  getMajor,
  getCollageMajors,
  createMajor,
  updateMajor,
  deleteMajor,
  getAllMajors
} from "../controllers/majorControllers.js";

//collages
router.route("/").post(createMajor).get(getAllMajors)
router.route("/major/:id").get(getMajor);
router
  .route("/:id")
  .patch(updateMajor)
  .delete(deleteMajor)
  .get(getCollageMajors);

export default router;
