const express = require("express");
const router = express.Router();

const {
    getCourse,
    getSemesterCourses,
    createCourse,
    updateCourse,
    deleteCourse,
} = require("../controllers/courseControllers");




//collages
router.route("/courses").post(createCourse);
router.route("/courses/getSemesterCourses/:id").get(getSemesterCourses)
router.route("/courses/:id").patch(updateCourse).delete(deleteCourse).get(getCourse);


module.exports = router;
