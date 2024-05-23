import { Router } from "express";
const router = Router();
import {
getAllSemesters,
createSemester,
startSemester,
updateSemester,
deleteSemester,
getSemester
} from "../controllers/semesterControllers.js"




router.route("/").get(getAllSemesters).post(startSemester);
// router.route("/startSemester").post(startSemester);
router.route("/:semId").patch(updateSemester).delete(deleteSemester).get(getSemester);


export default router;
