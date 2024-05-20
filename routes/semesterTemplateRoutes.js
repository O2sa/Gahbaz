import { Router } from "express";
const router = Router();
import {
    getSemesterTemplate,
    createSemesterTemplate,
    updateSemesterTemplate,
    deleteSemesterTemplate,
    addCourseToSemesterTemplate,
    getMajorTemplates,
    getAllemesterTemplates,
} from "../controllers/semesterTempControllers.js"




//collages
router.route("/").post(createSemesterTemplate).get(getAllemesterTemplates)
router.route("/addCourseToSemesterTemplate").post(addCourseToSemesterTemplate);
router.route("/template/:id").get(getSemesterTemplate)
router.route("/:id").get(getMajorTemplates).delete(deleteSemesterTemplate).patch(updateSemesterTemplate)


export default router;
