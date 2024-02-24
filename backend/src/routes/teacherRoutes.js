const express = require("express");
const router = express.Router();

const {
getTeacher,
createTeacher,
updateTeacher,
deleteTeacher,
getAllTeachers
} = require("../controllers/teacherControllers");




//collages
router.route("/teachers").post(createTeacher).get(getAllTeachers)
router.route("/teachers/:id").patch(updateTeacher).delete(deleteTeacher).get(getTeacher);


module.exports = router;
