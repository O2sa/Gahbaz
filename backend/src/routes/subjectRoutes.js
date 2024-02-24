const express = require("express");
const router = express.Router();

const {
getSubject,
createSubject,
updateSubject,
getCollageSubjects,
deleteSubject
} = require("../controllers/subjectControllers");




//collages
router.route("/subjects").post(createSubject);
router.route("/subjects/getCollageSubjects/:id").get(getCollageSubjects)
router.route("/subjects/:id").patch(updateSubject).delete(deleteSubject).get(getSubject);


module.exports = router;
