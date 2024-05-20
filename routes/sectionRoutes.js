import { Router } from "express";
const router = Router();
import {
  getSection,
  createSection,
  updateSection,
  deleteSection,
  getAllSections,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
  getLesson,
} from "../controllers/sectionControllers.js";

//collages
router.route("/").post(createSection).get(getAllSections);
router
  .route("/:id")
  .patch(updateSection)
  .delete(deleteSection)
  .get(getAllSections);
router.route("/:sectionId/lessons").post(createLesson).get(getAllLessons);
router
  .route("/:sectionId/lessons/:lessonId")
  .patch(updateLesson)
  .delete(deleteLesson)
  .get(getLesson);

export default router;
