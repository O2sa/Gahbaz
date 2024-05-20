import { Router } from "express";
const router = Router();
import {
getSubject,
createSubject,
updateSubject,
getCollageSubjects,
deleteSubject,
getCollageSubjectsByMajor
} from "../controllers/subjectControllers.js"




//collages
router.route("/").post(createSubject);
// router.route("/getCollageSubjects/:id").get(getCollageSubjects)
router.route("/:id").patch(updateSubject).delete(deleteSubject).get(getCollageSubjects);
router.route("/collage-subjects/:id").get(getCollageSubjectsByMajor)


export default router;
