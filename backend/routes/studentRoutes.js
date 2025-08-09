import { Router } from "express";
const router = Router();
import {
getStudent,
createStudent,
deleteStudent,
updateStudent,
getAllStudents

} from "../controllers/studentControllers.js"




//collages
router.route("/").post(createStudent).get(getAllStudents)
// router.route("/students/getCollageStudents/:id").get(getCollageStudents)
router.route("/:id").patch(updateStudent).delete(deleteStudent).get(getStudent);


export default router;
