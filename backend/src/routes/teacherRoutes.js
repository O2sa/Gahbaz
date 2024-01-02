const express = require("express");
const router = express.Router();

const {
  getCourseGrades,
  getAllCourses,
  updateCourseGrades,
  createTeacher
} = require("../controllers/teacherControllers");

router.route("/createTeacher").post(createTeacher);
router.route("/courses").get(getAllCourses);
router
  .route("/courses/:courseId")
  .get(getCourseGrades)
  .post(updateCourseGrades);

module.exports = router;
