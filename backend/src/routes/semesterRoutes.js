const express = require("express");
const router = express.Router();

const {
getAllSemesters,
createSemester,
startSemester
} = require("../controllers/semesterControllers");




router.route("/semesters").get(getAllSemesters).post(createSemester);
router.route("/semesters/startSemester").post(startSemester);
// router.route("/semesters/getCollageSemesters/:id").get(getCollageSemesters)
// router.route("/semesters/:id").patch(updateSemester).delete(deleteSemester).get(getSemester);


module.exports = router;
