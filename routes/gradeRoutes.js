import { Router } from "express";
const router = Router();
import {
    getGrade,
    createGrade,
    updateGrade,
    deleteGrade,
    getAllGrades,
    getStudentGrades
} from "../controllers/gradeControllers.js"




//collages
router.route("/student-grades/:studentId").get(getStudentGrades)
router.route("/:courseId").get(getAllGrades).post(createGrade)
router.route("/:gradeId").patch(updateGrade).delete(deleteGrade).get(getGrade);


export default router;
