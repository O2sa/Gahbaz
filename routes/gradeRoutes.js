import { Router } from "express";
const router = Router();
import {
    getGrade,
    createGrade,
    updateGrade,
    deleteGrade,
    getAllGrades
} from "../controllers/gradeControllers.js"




//collages
// router.route("/").get(createGrade)
router.route("/:courseId").get(getAllGrades).post(createGrade)
router.route("/:gradeId").patch(updateGrade).delete(deleteGrade).get(getGrade);


export default router;
