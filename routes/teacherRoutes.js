import { Router } from "express";
const router = Router();
import {
getTeacher,
createTeacher,
updateTeacher,
deleteTeacher,
getAllTeachers
} from "../controllers/teacherControllers.js"




//collages
router.route("/").post(createTeacher).get(getAllTeachers)
router.route("/:id").patch(updateTeacher).delete(deleteTeacher).get(getTeacher);


export default router;
