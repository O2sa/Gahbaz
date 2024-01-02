const express = require("express");
const router = express.Router();

const {
  createStudent,
  getSemstersGrades,
  getCurrentCourses,
} = require("../controllers/studentControllers.js");

router.route("/createStudent").post(createStudent);
router.route("/getSemstersGrades").get(getSemstersGrades);
router.route("/getCurrentCourses").get(getCurrentCourses);

module.exports = router;
