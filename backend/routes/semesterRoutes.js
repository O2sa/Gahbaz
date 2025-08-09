import { Router } from "express";
const router = Router();
import {
getAllSemesters,
createSemester,
startSemester,
updateSemester,
deleteSemester,
getSemester,
endSemester
} from "../controllers/semesterControllers.js"




router.route("/").get(getAllSemesters).post(startSemester);
// router.route("/startSemester").post(startSemester);
router.route("/:semId").patch(updateSemester).delete(deleteSemester).get(getSemester);
router.route("/:semId/end-semester").patch(endSemester)


export default router;
