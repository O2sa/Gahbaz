import { Router } from "express";
const router = Router();
import {
    getCourse,
    getSemesterCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses
} from "../controllers/courseControllers.js"




//collages
router.route("/").post(createCourse).get(getAllCourses)
router.route("/getSemesterCourses/:id").get(getSemesterCourses)
router.route("/:id").patch(updateCourse).delete(deleteCourse).get(getCourse);


export default router;
